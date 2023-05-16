import { useState } from "react";

const useHovered = () => {
  const [isHovered, setHovered] = useState(false);

  return [
    isHovered,
    {
      onMouseEnter: () => setHovered(true),
      onMouseLeave: () => setHovered(false),
    },
  ] as const;
};

export default useHovered;
