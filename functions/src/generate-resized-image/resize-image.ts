/* eslint-disable operator-linebreak */
/* eslint-disable max-len */
/* eslint-disable indent */
/* eslint-disable object-curly-spacing */
/* eslint-disable require-jsdoc */
import * as os from "os";
import * as sharp from "sharp";
import * as path from "path";
import * as fs from "fs";

import { Bucket } from "@google-cloud/storage";
import { ObjectMetadata } from "firebase-functions/lib/providers/storage";
import { v4 as uuid } from "uuid";

import config from "./config";
import * as logs from "./logs";

export interface ResizedImageResult {
  size: string;
  success: boolean;
}

export function resize(
  file:
    | string
    | Buffer
    | Uint8Array
    | Uint8ClampedArray
    | Int8Array
    | Uint16Array
    | Int16Array
    | Uint32Array
    | Int32Array
    | Float32Array
    | Float64Array
    | undefined,
  size: string
) {
  let height;
  let width;
  if (size.indexOf(",") !== -1) {
    [width, height] = size.split(",");
  } else if (size.indexOf("x") !== -1) {
    [width, height] = size.split("x");
  } else {
    throw new Error("height and width are not delimited by a ',' or a 'x'");
  }

  return sharp(file, { failOnError: false })
    .rotate()
    .resize(parseInt(width, 10), parseInt(height, 10), {
      fit: "inside",
      withoutEnlargement: true,
    })
    .toBuffer();
}

export function convertType(
  buffer: sharp.SharpOptions | undefined,
  format: string
) {
  if (format === "jpg" || format === "jpeg") {
    return sharp(buffer).jpeg().toBuffer();
  }

  if (format === "png") {
    return sharp(buffer).png().toBuffer();
  }

  if (format === "webp") {
    return sharp(buffer).webp().toBuffer();
  }

  if (format === "tiff" || format === "tif") {
    return sharp(buffer).tiff().toBuffer();
  }

  return buffer;
}

/**
 * Supported file types
 */
export const supportedContentTypes = [
  "image/jpeg",
  "image/png",
  "image/tiff",
  "image/webp",
];

export const supportedImageContentTypeMap = {
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  png: "image/png",
  tif: "image/tif",
  tiff: "image/tiff",
  webp: "image/webp",
};

const supportedExtensions = Object.keys(supportedImageContentTypeMap).map(
  (type) => `.${type}`
);

export const modifyImage = async ({
  bucket,
  originalFile,
  fileDir,
  fileNameWithoutExtension,
  fileExtension,
  contentType,
  size,
  objectMetadata,
  format,
}: {
  bucket: Bucket;
  originalFile: string;
  fileDir: string;
  fileNameWithoutExtension: string;
  fileExtension: string;
  contentType: string;
  size: string;
  objectMetadata: ObjectMetadata;
  format: string;
}): Promise<ResizedImageResult> => {
  const shouldFormatImage = format !== "false";
  const formatAsserted = format as keyof typeof supportedImageContentTypeMap;
  const imageContentType = shouldFormatImage
    ? supportedImageContentTypeMap[formatAsserted]
    : contentType;
  const modifiedExtensionName =
    fileExtension && shouldFormatImage ? `.${format}` : fileExtension;

  let modifiedFileName;

  if (supportedExtensions.includes(fileExtension.toLowerCase())) {
    modifiedFileName = `${fileNameWithoutExtension}_${size}${modifiedExtensionName}`;
  } else {
    // Fixes https://github.com/firebase/extensions/issues/476
    modifiedFileName = `${fileNameWithoutExtension}${fileExtension}_${size}`;
  }

  // Path where modified image will be uploaded to in Storage.
  const modifiedFilePath = path.normalize(
    config.resizedImagesPath
      ? path.join(fileDir, config.resizedImagesPath, modifiedFileName)
      : path.join(fileDir, modifiedFileName)
  );
  let modifiedFile = "";

  try {
    modifiedFile = path.join(os.tmpdir(), modifiedFileName);

    // Cloud Storage files.
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const metadata: { [key: string]: any } = {
      contentDisposition: objectMetadata.contentDisposition,
      contentEncoding: objectMetadata.contentEncoding,
      contentLanguage: objectMetadata.contentLanguage,
      contentType: imageContentType,
      metadata: objectMetadata.metadata || {},
    };
    metadata.metadata.resizedImage = true;
    if (config.cacheControlHeader) {
      metadata.cacheControl = config.cacheControlHeader;
    } else {
      metadata.cacheControl = objectMetadata.cacheControl;
    }

    // If the original image has a download token, add a
    // new token to the image being resized #323
    if (metadata.metadata.firebaseStorageDownloadTokens) {
      metadata.metadata.firebaseStorageDownloadTokens = uuid();
    }

    // Generate a resized image buffer using Sharp.
    logs.imageResizing(modifiedFile, size);
    let modifiedImageBuffer: Buffer | sharp.SharpOptions | undefined =
      await resize(originalFile, size);
    logs.imageResized(modifiedFile);

    // Generate a converted image type buffer using Sharp.

    if (shouldFormatImage) {
      logs.imageConverting(fileExtension, format);
      modifiedImageBuffer = await convertType(
        modifiedImageBuffer as sharp.SharpOptions,
        format
      );
      logs.imageConverted(format);
    }

    // Generate a image file using Sharp.
    await sharp(modifiedImageBuffer as sharp.SharpOptions).toFile(modifiedFile);

    // Uploading the modified image.
    logs.imageUploading(modifiedFilePath);
    await bucket.upload(modifiedFile, {
      destination: modifiedFilePath,
      metadata,
    });
    logs.imageUploaded(modifiedFile);

    return { size, success: true };
  } catch (err) {
    logs.error(err as Error);
    return { size, success: false };
  } finally {
    try {
      // Make sure the local resized file is cleaned up to free up disk space.
      if (modifiedFile.length) {
        logs.tempResizedFileDeleting(modifiedFilePath);
        fs.unlinkSync(modifiedFile);
        logs.tempResizedFileDeleted(modifiedFilePath);
      }
    } catch (err) {
      logs.errorDeleting(err as Error);
    }
  }
};
