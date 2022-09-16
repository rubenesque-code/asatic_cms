import {
  createContext,
  CSSProperties,
  Dispatch,
  ReactElement,
  SetStateAction,
  useContext,
  useState,
} from "react";
import { Popover as HeadlessPopover } from "@headlessui/react";
import { usePopper } from "react-popper";
import tw from "twin.macro";

// todo: panel not initially in correct position (setting unmount = true not an option as leads to other positioning errors)

// * `Popover` does not position itself but needs css/js/usePopper/etc. to do so

type PopperContextValue = {
  popperAttributes: {
    [key: string]:
      | {
          [key: string]: string;
        }
      | undefined;
  };
  popperStyles: CSSProperties;
  setPopperElement: Dispatch<SetStateAction<HTMLDivElement | null>>;
  setReferenceElement: Dispatch<SetStateAction<HTMLDivElement | null>>;
};
const PopperContext = createContext<PopperContextValue>(
  {} as PopperContextValue
);

const PopperContextProvider = ({ children }: { children: ReactElement }) => {
  const [referenceElement, setReferenceElement] =
    useState<HTMLDivElement | null>(null);
  const [popperElement, setPopperElement] = useState<HTMLDivElement | null>(
    null
  );

  const { styles: popperStyles, attributes: popperAttributes } = usePopper(
    referenceElement,
    popperElement,
    {
      placement: "auto",
      modifiers: [
        { name: "offset", options: { offset: [0, 10] } },
        { name: "preventOverflow", options: { padding: 8 } },
      ],
    }
  );

  return (
    <PopperContext.Provider
      value={{
        popperAttributes,
        popperStyles: popperStyles.popper,
        setPopperElement,
        setReferenceElement,
      }}
    >
      {children}
    </PopperContext.Provider>
  );
};

function ProximityPopover({
  children,
}: {
  children: ReactElement | (({ isOpen }: { isOpen?: boolean }) => ReactElement);
}) {
  return (
    <PopperContextProvider>
      <HeadlessPopover css={[tw`relative`]}>
        {({ open: isOpen }) => (
          <>
            {typeof children === "function" ? children({ isOpen }) : children}
            <HeadlessPopover.Overlay
              css={[tw`fixed inset-0 bg-overlayLight`]}
            />
          </>
        )}
      </HeadlessPopover>
    </PopperContextProvider>
  );
}

export default ProximityPopover;

ProximityPopover.Button = function PopoverButton({
  children,
}: {
  children: ReactElement;
}) {
  const { setReferenceElement } = useContext(PopperContext);

  return (
    <HeadlessPopover.Button
      as="div"
      css={[tw`inline-block`]}
      ref={setReferenceElement}
    >
      {children}
    </HeadlessPopover.Button>
  );
};

ProximityPopover.Panel = function PopoverPanel({
  children,
  isOpen,
}: {
  children: ReactElement | (({ close }: { close: () => void }) => ReactElement);
  isOpen?: boolean | undefined;
}) {
  const { popperAttributes, popperStyles, setPopperElement } =
    useContext(PopperContext);

  return (
    <HeadlessPopover.Panel
      css={[
        tw`z-50 transition-opacity duration-75 ease-in-out`,
        isOpen ? tw`visible opacity-100` : tw`invisible opacity-0`,
      ]}
      style={popperStyles}
      ref={setPopperElement}
      {...popperAttributes}
    >
      {({ close }) =>
        typeof children === "function" ? children({ close }) : children
      }
    </HeadlessPopover.Panel>
  );
};
