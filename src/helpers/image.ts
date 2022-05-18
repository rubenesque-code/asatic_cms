const getImageEndpoint = (fullUrl: string) => {
  const match = fullUrl.match(/%(.*)/);
  if (match) {
    return match[1];
  }

  throw new Error("imageUrl regex fail");
};

export { getImageEndpoint };
