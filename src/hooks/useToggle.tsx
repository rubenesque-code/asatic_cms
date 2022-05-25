import { useState } from "react";

/** 1: isOn 2: set to on 3: set to off */
const useToggle = () => {
  const [on, toggle] = useState(false);
  const setOn = () => toggle(true);
  const setOff = () => toggle(false);

  return [on, setOn, setOff] as const;
};

export default useToggle;
