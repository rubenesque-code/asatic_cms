export const checkIsYoutubeUrl = (value: string) => {
  const regex =
    /^((?:https?:)?\/\/)?((?:www|m)\.)?((?:youtube(-nocookie)?\.com|youtu.be))(\/(?:[\w\-]+\?v=|embed\/|v\/)?)([\w\-]+)(\S+)?$/;
  const isValid = regex.test(value);

  return isValid;
};

export const getYoutubeVideoIdFromUrl = (url: string) => {
  const regex = /.*(?:youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=)([^#\&\?]*).*/;
  const match = url.match(regex);

  if (!match) {
    return null;
  }

  const id = match[1];

  return id;
};

export const getYoutubeEmbedUrlFromId = (id: string) => {
  const embedUrl = `https://www.youtube.com/embed/${id}`;

  return embedUrl;
};

export const getYoutubeWatchUrlFromId = (id: string) => {
  const embedUrl = `https://www.youtube.com/watch?v=${id}`;

  return embedUrl;
};

export const getThumbnailFromYoutubeId = (id: string): string =>
  `https://img.youtube.com/vi/${id}/0.jpg`;
