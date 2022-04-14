import { useState } from "react";

const useToggle = () => {
  const [on, toggle] = useState(false);
  const setOn = () => toggle(true);
  const setOff = () => toggle(false);

  return [on, setOn, setOff] as const;
};

export default useToggle;
