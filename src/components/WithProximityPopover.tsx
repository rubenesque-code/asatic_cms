import { ReactElement, useState } from "react";
import { Popover } from "@headlessui/react";
import tw from "twin.macro";
import { usePopper } from "react-popper";

// * `Popover` does not position itself but needs css/js/usePopper/etc. to do so
// * `Popover.Panel` had a bug where it'd move from its default position to `usePopper's` on initial load - so have handled open/close state manually

const WithProximityPopover = ({
  children,
  disabled,
  panelContentElement,
}: {
  children: ReactElement | (({ isOpen }: { isOpen?: boolean }) => ReactElement);
  disabled?: boolean;
  panelContentElement:
    | ReactElement
    | (({ close }: { close: () => void }) => ReactElement);
}) => {
  const [referenceElement, setReferenceElement] =
    useState<HTMLDivElement | null>(null);
  const [popperElement, setPopperElement] = useState<HTMLDivElement | null>(
    null
  );
  const { styles: popperStyles, attributes: popperAttributes } = usePopper(
    referenceElement,
    popperElement,
    {
      modifiers: [
        { name: "offset", options: { offset: [0, 10] } },
        { name: "preventOverflow", options: { padding: 8 } },
      ],
    }
  );

  const childElement =
    typeof children === "function" ? children({ isOpen: false }) : children;

  if (disabled) {
    return childElement;
  }

  return (
    <>
      <Popover>
        {({ open }) => (
          <>
            <Popover.Button
              as="div"
              css={[tw`grid place-items-center`]}
              ref={setReferenceElement}
            >
              {childElement}
            </Popover.Button>
            <Popover.Panel
              css={[
                tw`z-50 transition-all duration-75 ease-in-out`,
                open ? tw`visible opacity-100` : tw`invisible opacity-0`,
              ]}
              style={popperStyles.popper}
              ref={setPopperElement}
              {...popperAttributes}
            >
              {({ close }) => (
                <div css={[s.panelContainer]}>
                  {typeof panelContentElement === "function"
                    ? panelContentElement({ close })
                    : panelContentElement}
                </div>
              )}
            </Popover.Panel>
            <Popover.Overlay css={[tw`fixed inset-0 bg-overlayLight`]} />
          </>
        )}
      </Popover>
    </>
  );
};

export default WithProximityPopover;

const s = {
  panelContainer: tw`z-50 bg-white shadow-lg rounded-md`,
};
