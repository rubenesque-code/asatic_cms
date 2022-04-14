import { ReactElement } from "react";
import WithClickOutside from "./WithClickOutside";

const FixedOverlayCard = ({
  show,
  children,
  onClickOutside,
}: {
  show: boolean;
  children: ReactElement;
  onClickOutside: () => void;
}) => {
  return (
    <div
      className={`fixed grid place-items-center transition-opacity ease-in-out duration-75 top-0 left-0 w-full h-screen bg-overlayLight ${
        show ? "opacity-100" : "opacity-0 hidden"
      }`}
    >
      <WithClickOutside onClickOutside={onClickOutside}>
        <div className="bg-white rounded-md p-xl">{children}</div>
      </WithClickOutside>
    </div>
  );
};

export default FixedOverlayCard;
