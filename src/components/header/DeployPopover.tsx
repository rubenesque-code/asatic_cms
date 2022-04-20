import { Popover } from "@headlessui/react";
import { CaretDown, CloudArrowUp } from "phosphor-react";
import tw from "twin.macro";

const DeployPopover = () => {
  return (
    <Popover css={[s.popover]}>
      <Popover.Button css={[s.button]}>
        <span css={[s.icon]}>
          <CloudArrowUp />
        </span>
        <span>Deploy</span>
        <span css={[s.caret]}>
          <CaretDown />
        </span>
      </Popover.Button>
      <Popover.Panel css={[s.panel]}>Hello</Popover.Panel>
    </Popover>
  );
};

export default DeployPopover;

const s = {
  popover: tw`relative`,
  button: tw`flex gap-xs items-center`,
  icon: tw`text-lg`,
  caret: tw`text-gray-500`,
  panel: tw`p-lg bg-white absolute origin-top bottom-0 translate-y-full shadow-lg rounded-md`,
};
