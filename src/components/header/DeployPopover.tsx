import { Popover, Transition } from "@headlessui/react";
import { CaretDown, CloudArrowUp } from "phosphor-react";
import { Fragment } from "react";
import tw, { css } from "twin.macro";
import WithTooltip from "^components/WithTooltip";
import {
  buttonSelectorTransition,
  subIconButtonDefault,
} from "^styles/buttons";

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
          <Transition
            as={Fragment}
            enter="transition ease-out duration-200"
            enterFrom="opacity-0 translate-y-1"
            enterTo="opacity-100 translate-y-0"
            leave="transition ease-in duration-150"
            leaveFrom="opacity-100 translate-y-0"
            leaveTo="opacity-0 translate-y-1"
          >
            <Popover.Panel css={[s.panel]}>Hello</Popover.Panel>
          </Transition>
        </>
      )}
    </Popover>
  );
};

export default DeployPopover;

const s = {
  popover: tw`relative`,
  button: tw`flex gap-xxs py-xxs px-xs items-center`,
  icon: tw`text-lg mr-xxs`,
  caret: css`
    ${subIconButtonDefault} ${buttonSelectorTransition} ${tw`group-hover:bg-gray-100 group-active:bg-gray-200`}
  `,
  panel: tw`p-lg bg-white absolute origin-top bottom-0 translate-y-full shadow-lg rounded-md`,
};
