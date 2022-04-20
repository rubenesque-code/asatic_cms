import { ReactElement } from "react";
import tw from "twin.macro";
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
    <div css={[s.container, show ? s.show : s.hide]}>
      <WithClickOutside onClickOutside={onClickOutside}>
        <div css={[s.card]}>{children}</div>
      </WithClickOutside>
    </div>
  );
};

export default FixedOverlayCard;

const s = {
  container: tw`fixed z-50 grid place-items-center transition-opacity ease-in-out duration-75 top-0 left-0 w-full h-screen bg-overlayLight`,
  show: tw`opacity-100`,
  hide: tw`opacity-0 hidden`,
  card: tw`bg-white rounded-md p-xl`,
};
