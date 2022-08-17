const getImageEndpoint = (fullUrl: string) => {
  const match = fullUrl.match(/%(.*)/);
  if (match) {
    return match[1];
  }

  throw new Error("imageUrl regex fail");
};

export { getImageEndpoint };

export const generateImgVertPosition = (
  imgVertPosition: number,
  updateFunc: (imgVertPosition: number) => void
) => {
  const canFocusHigher = imgVertPosition > 0;
  const canFocusLower = imgVertPosition < 100;

  const positionChangeAmount = 10;

  const focusHigher = () => {
    if (!canFocusHigher) {
      return;
    }
    const updatedPosition = imgVertPosition - positionChangeAmount;
    updateFunc(updatedPosition);
  };
  const focusLower = () => {
    if (!canFocusLower) {
      return;
    }
    const updatedPosition = imgVertPosition + positionChangeAmount;
    updateFunc(updatedPosition);
  };

  return {
    canFocusHigher,
    canFocusLower,
    focusHigher,
    focusLower,
  };
};
