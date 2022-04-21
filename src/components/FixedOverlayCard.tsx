import { Transition } from "@headlessui/react";
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
    <Transition
      show={show}
      as="div"
      css={[s.container]}
      enter="transition ease-out duration-100"
      enterFrom="transform opacity-0 scale-95"
      enterTo="transform opacity-100 scale-100"
      leave="transition ease-in duration-75"
      leaveFrom="transform opacity-100 scale-100"
      leaveTo="transform opacity-0 scale-95"
    >
      <WithClickOutside onClickOutside={onClickOutside}>
        <div css={[s.card]}>{children}</div>
      </WithClickOutside>
    </Transition>
  );
};

export default FixedOverlayCard;

const s = {
  container: tw`fixed z-50 grid place-items-center top-0 left-0 w-full h-screen bg-overlayLight`,
  card: tw`bg-white rounded-md p-xl`,
};
