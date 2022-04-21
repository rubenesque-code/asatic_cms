import { Popover } from "@headlessui/react";
import { CaretDown, CloudArrowUp } from "phosphor-react";
import tw from "twin.macro";
import WithTooltip from "^components/WithTooltip";

const DeployPopover = () => {
  return (
    <Popover className="group" css={[s.popover]}>
      <WithTooltip text="View deploy panel">
        <div>
          <Popover.Button css={[s.button]}>
            <span css={[s.icon]}>
              <CloudArrowUp />
            </span>
            <span>Deploy</span>
            <span css={[s.caret]}>
              <CaretDown />
            </span>
          </Popover.Button>
        </div>
      </WithTooltip>
      <Popover.Panel css={[s.panel]}>Hello</Popover.Panel>
    </Popover>
  );
};

export default DeployPopover;

const s = {
  popover: tw`relative`,
  button: tw`flex gap-xxs items-center`,
  icon: tw`text-lg mr-xxs`,
  caret: tw`text-gray-500 rounded-full p-xxs group-hover:bg-gray-100`,
  panel: tw`p-lg bg-white absolute origin-top bottom-0 translate-y-full shadow-lg rounded-md`,
};
