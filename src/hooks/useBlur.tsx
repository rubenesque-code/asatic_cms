import { useState } from "react";

const useBlur = () => {
  const [timeoutId, setTimeoutId] = useState<null | NodeJS.Timeout>(null);
  const blurHandler = (onBlur: () => void) => {
    const timeoutId = setTimeout(() => onBlur());
    setTimeoutId(timeoutId);
  };
  const focusHandler = () => timeoutId && clearTimeout(timeoutId);

  return {
    blurHandler,
    focusHandler,
  };
};

export default useBlur;
