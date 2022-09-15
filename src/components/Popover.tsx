import { Dispatch, ReactElement, SetStateAction, useState } from "react";
import { Popover as HeadlessPopover } from "@headlessui/react";
import { usePopper } from "react-popper";
import tw, { TwStyle } from "twin.macro";
import { Placement } from "@popperjs/core";

// todo: panel not initially in correct position (setting unmount = true not an option as leads to other positioning errors)

// * `Popover` does not position itself but needs css/js/usePopper/etc. to do so

function Popover({
  children,
  isDisabled,
  panel,
  panelMaxWidth,
  placement = "auto",
}: {
  children: ReactElement | (({ isOpen }: { isOpen?: boolean }) => ReactElement);
  isDisabled?: boolean;
  panel: ReactElement | (({ close }: { close: () => void }) => ReactElement);
  panelMaxWidth?: TwStyle;
  placement?: Placement;
}) {
  const [referenceElement, setReferenceElement] =
    useState<HTMLDivElement | null>(null);
  const [popperElement, setPopperElement] = useState<HTMLDivElement | null>(
    null
  );
  const { styles: popperStyles, attributes: popperAttributes } = usePopper(
    referenceElement,
    popperElement,
    {
      placement,
      modifiers: [
        { name: "offset", options: { offset: [0, 10] } },
        { name: "preventOverflow", options: { padding: 8 } },
      ],
    }
  );

  const childElement =
    typeof children === "function" ? children({ isOpen: false }) : children;

  if (isDisabled) {
    return childElement;
  }

  return (
    <>
      <HeadlessPopover css={[tw`relative`]}>
        {({ open }) => (
          <>
            <HeadlessPopover.Panel
              css={[
                tw`z-50 transition-opacity duration-75 ease-in-out`,
                open ? tw`visible opacity-100` : tw`invisible opacity-0`,
                panelMaxWidth && panelMaxWidth,
              ]}
              style={popperStyles.popper}
              ref={setPopperElement}
              {...popperAttributes}
            >
              {({ close }) =>
                typeof panel === "function" ? panel({ close }) : panel
              }
            </HeadlessPopover.Panel>
            <HeadlessPopover.Overlay
              css={[tw`fixed inset-0 bg-overlayLight`]}
            />
          </>
        )}
      </HeadlessPopover>
    </>
  );
}

export default Popover;

Popover.Button = function PopoverButton({
  children,
  setReferenceElement,
}: {
  children: ReactElement | (({ isOpen }: { isOpen?: boolean }) => ReactElement);
  setReferenceElement: Dispatch<SetStateAction<HTMLDivElement | null>>;
}) {
  return (
    <HeadlessPopover.Button
      as="div"
      css={[tw`grid place-items-center`]}
      ref={setReferenceElement}
    >
      {typeof children === "function" ? children({ isOpen: false }) : children}
    </HeadlessPopover.Button>
  );
};
