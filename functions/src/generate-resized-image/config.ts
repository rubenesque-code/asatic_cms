export enum deleteImage {
  always = 0,
  never,
  onSuccess,
}

// eslint-disable-next-line require-jsdoc
function deleteOriginalFile(deleteType: string | undefined) {
  switch (deleteType) {
    case "true":
      return deleteImage.always;
    case "false":
      return deleteImage.never;
    default:
      return deleteImage.onSuccess;
  }
}

// eslint-disable-next-line require-jsdoc
function paramToArray(param: string | undefined) {
  return typeof param === "string" ? param.split(",") : undefined;
}

export default {
  bucket: process.env.IMG_BUCKET,
  cacheControlHeader: process.env.CACHE_CONTROL_HEADER,
  imageSizes: process.env.IMG_SIZES?.split(","),
  resizedImagesPath: process.env.RESIZED_IMAGES_PATH,
  includePathList: paramToArray(process.env.INCLUDE_PATH_LIST),
  excludePathList: paramToArray(process.env.EXCLUDE_PATH_LIST),
  deleteOriginalFile: deleteOriginalFile(process.env.DELETE_ORIGINAL_FILE),
  imageTypes: paramToArray(process.env.IMAGE_TYPE),
};
