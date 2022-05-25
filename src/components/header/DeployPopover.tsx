import { Fragment } from "react";
import { Popover } from "@headlessui/react";
import tw, { css } from "twin.macro";
import { CaretDown, CloudArrowUp } from "phosphor-react";

import WithTooltip from "^components/WithTooltip";

import s_button from "^styles/button";

const DeployPopover = () => {
  return (
    <Popover className="group" css={[s.popover]}>
      {({ open }) => (
        <>
          <WithTooltip text="View deploy panel" isDisabled={open}>
            <Popover.Button css={[s.button]}>
              <span css={[s.icon]}>
                <CloudArrowUp />
              </span>
              <span>Deploy</span>
              <span css={[s.caret]}>
                <CaretDown />
              </span>
            </Popover.Button>
          </WithTooltip>
          <Popover.Panel css={[s.panel]}>Hello</Popover.Panel>
        </>
      )}
    </Popover>
  );
};

export default DeployPopover;

const s = {
  popover: tw`relative hover:z-50`,
  button: tw`flex gap-xxs py-xxs px-xs items-center text-sm font-medium`,
  icon: tw`text-lg mr-xxs`,
  caret: css`
    ${s_button.subIcon} ${tw`transition-all duration-75 ease-in-out`} ${tw`group-hover:bg-gray-100 group-active:bg-gray-200`}
  `,
  panel: tw`z-50 p-lg bg-white absolute origin-top bottom-0 translate-y-full shadow-lg rounded-md`,
};
