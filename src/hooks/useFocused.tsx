import { useState } from "react";

const useFocused = () => {
  const [isFocused, setFocused] = useState(false);

  return [
    isFocused,
    {
      onFocus: () => setFocused(true),
      onBlur: () => setFocused(false),
    },
  ] as const;
};

export default useFocused;
