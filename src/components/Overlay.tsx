import { Transition } from "@headlessui/react";
import tw from "twin.macro";

const Overlay = ({ show }: { show: boolean }) => {
  return (
    <Transition
      show={show}
      as="div"
      css={[s.static]}
      enter="transition ease-out duration-100"
      enterFrom="transform opacity-0 scale-95"
      enterTo="transform opacity-100 scale-100"
      leave="transition ease-in duration-75"
      leaveFrom="transform opacity-100 scale-100"
      leaveTo="transform opacity-0 scale-95"
    />
  );
};

export default Overlay;

const s = {
  static: tw`fixed z-40 top-0 left-0 w-full h-screen bg-overlayLight`,
};
