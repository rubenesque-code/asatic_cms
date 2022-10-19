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

import { checkObjectHasField } from "^helpers/general";

// * `Popover` does not position itself but needs css/js/usePopper/etc. to do so

type PopperContextValue = {
  isOpen: boolean;
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

const PopperContextProvider = ({
  children,
  isOpen,
}: {
  children: ReactElement;
  isOpen: boolean;
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
        isOpen,
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

function ProximityPopover({ children }: { children: ReactElement }) {
  return (
    <HeadlessPopover css={[tw`relative grid place-items-center`]}>
      {({ open: isOpen }) => (
        <PopperContextProvider isOpen={isOpen}>
          <>
            {children}
            <HeadlessPopover.Overlay
              css={[tw`fixed inset-0 bg-overlayLight`]}
            />
          </>
        </PopperContextProvider>
      )}
    </HeadlessPopover>
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
      css={[tw`inline-grid place-items-center`]}
      ref={setReferenceElement}
    >
      {children}
    </HeadlessPopover.Button>
  );
};

ProximityPopover.Panel = function PopoverPanel({
  children,
}: {
  children: ReactElement | (({ close }: { close: () => void }) => ReactElement);
}) {
  const { popperAttributes, popperStyles, setPopperElement, isOpen } =
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

ProximityPopover.useContext = function useProximityPopoverContext() {
  const context = useContext(PopperContext);
  const contextIsEmpty = !checkObjectHasField(context);
  if (contextIsEmpty) {
    throw new Error(
      "useProximityPopoverContext must be used within its provider!"
    );
  }
  const { isOpen } = context;

  return { isOpen };
};
