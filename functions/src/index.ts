/* eslint-disable object-curly-spacing */
/* eslint-disable indent */
/* eslint-disable max-len */
import * as admin from "firebase-admin";
import * as fs from "fs";
import * as functions from "firebase-functions";
import * as mkdirp from "mkdirp";
import * as os from "os";
import * as path from "path";
import * as sharp from "sharp";
import { Bucket } from "@google-cloud/storage";

import {
  ResizedImageResult,
  modifyImage,
  supportedContentTypes,
} from "./generate-resized-image/resize-image";
import config, { deleteImage } from "./generate-resized-image/config";
import * as logs from "./generate-resized-image/logs";
import {
  extractFileNameWithoutExtension,
  startsWithArray,
} from "./generate-resized-image/utils";

sharp.cache(false);

// Initialize the Firebase Admin SDK
admin.initializeApp();

logs.init();

/**
 * When an image is uploaded in the Storage bucket, we generate a resized image automatically using
 * the Sharp image converting library.
 */
export const generateResizedImage = functions.storage
  .object()
  .onFinalize(async (object): Promise<void> => {
    logs.start();
    const { contentType } = object; // This is the image MIME type

    const tmpFilePath = path.resolve("/", path.dirname(object.name || "")); // Absolute path to dirname

    if (!contentType) {
      logs.noContentType();
      return;
    }

    if (!contentType.startsWith("image/")) {
      logs.contentTypeInvalid(contentType);
      return;
    }

    if (object.contentEncoding === "gzip") {
      logs.gzipContentEncoding();
      return;
    }

    if (!supportedContentTypes.includes(contentType)) {
      logs.unsupportedType(supportedContentTypes, contentType);
      return;
    }

    if (
      config.includePathList &&
      !startsWithArray(config.includePathList, tmpFilePath)
    ) {
      logs.imageOutsideOfPaths(config.includePathList, tmpFilePath);
      return;
    }

    if (
      config.excludePathList &&
      startsWithArray(config.excludePathList, tmpFilePath)
    ) {
      logs.imageInsideOfExcludedPaths(config.excludePathList, tmpFilePath);
      return;
    }

    if (object.metadata && object.metadata.resizedImage === "true") {
      logs.imageAlreadyResized();
      return;
    }

    const bucket = admin.storage().bucket(object.bucket) as unknown as Bucket;
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const filePath = object.name!; // File path in the bucket.
    const fileDir = path.dirname(filePath);
    const fileExtension = path.extname(filePath);
    const fileNameWithoutExtension = extractFileNameWithoutExtension(
      filePath,
      fileExtension
    );
    const objectMetadata = object;

    let originalFile = "";
    let remoteFile;
    try {
      originalFile = path.join(os.tmpdir(), filePath);
      const tempLocalDir = path.dirname(originalFile);

      // Create the temp directory where the storage file will be downloaded.
      logs.tempDirectoryCreating(tempLocalDir);
      await mkdirp(tempLocalDir);
      logs.tempDirectoryCreated(tempLocalDir);

      // Download file from bucket.
      remoteFile = bucket.file(filePath);
      logs.imageDownloading(filePath);
      await remoteFile.download({ destination: originalFile });
      logs.imageDownloaded(filePath, originalFile);

      // Get a unique list of image types
      const imageTypes = new Set(config.imageTypes);

      // Convert to a set to remove any duplicate sizes
      const imageSizes = new Set(config.imageSizes);

      const tasks: Promise<ResizedImageResult>[] = [];

      imageTypes.forEach((format) => {
        imageSizes.forEach((size) => {
          tasks.push(
            modifyImage({
              bucket,
              originalFile,
              fileDir,
              fileNameWithoutExtension,
              fileExtension,
              contentType,
              size,
              objectMetadata: objectMetadata,
              format,
            })
          );
        });
      });

      const results = await Promise.all(tasks);

      const failed = results.some((result) => result.success === false);
      if (failed) {
        logs.failed();
        return;
      } else {
        if (config.deleteOriginalFile === deleteImage.onSuccess) {
          if (remoteFile) {
            try {
              logs.remoteFileDeleting(filePath);
              await remoteFile.delete();
              logs.remoteFileDeleted(filePath);
            } catch (err) {
              logs.errorDeleting(err as Error);
            }
          }
        }
        logs.complete();
      }
    } catch (err) {
      logs.error(err as Error);
    } finally {
      if (originalFile.length) {
        logs.tempOriginalFileDeleting(filePath);
        fs.unlinkSync(originalFile);
        logs.tempOriginalFileDeleted(filePath);
      }
      if (config.deleteOriginalFile === deleteImage.always) {
        // Delete the original file
        if (remoteFile) {
          try {
            logs.remoteFileDeleting(filePath);
            await remoteFile.delete();
            logs.remoteFileDeleted(filePath);
          } catch (err) {
            logs.errorDeleting(err as Error);
          }
        }
      }
    }
  });
