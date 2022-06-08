import { Popover } from "@headlessui/react";
import { ReactElement, useState } from "react";
import tw, { TwStyle } from "twin.macro";
import { usePopper } from "react-popper";
import { Warning } from "phosphor-react";

// * `Popover` does not position itself but needs css/js/usePopper/etc. to do so
// * `Popover.Panel` had a bug where it'd move from its default position to `usePopper's` on initial load - so have handled open/close state manually

const WithWarning = ({
  children,
  callbackToConfirm,
  disabled,
  proceedButtonStyles = tw`text-white bg-red-warning hover:bg-red-700 hover:text-white border-red-warning hover:border-red-700`,
  // proceedButtonStyles = tw`text-red-500 border-red-500`,
  warningText = "Are you sure?",
}: {
  callbackToConfirm: () => void;
  children: ReactElement | (({ isOpen }: { isOpen?: boolean }) => ReactElement);
  disabled?: boolean;
  warningText?:
    | {
        heading: string;
        body?: string;
      }
    | string;
  proceedButtonStyles?: TwStyle;
}) => {
  const [referenceElement, setReferenceElement] =
    useState<HTMLDivElement | null>(null);
  const [popperElement, setPopperElement] = useState<HTMLDivElement | null>(
    null
  );
  const { styles, attributes } = usePopper(referenceElement, popperElement, {
    modifiers: [
      { name: "offset", options: { offset: [0, 10] } },
      { name: "preventOverflow", options: { padding: 8 } },
    ],
  });

  if (disabled) {
    return typeof children === "function"
      ? children({ isOpen: false })
      : children;
  }

  // const headingLength = warningText.heading.length
  // const bodyLength = warningText.body?.length || 0
  // const textLongestLength = headingLength > bodyLength ? headingLength : bodyLength

  // const useTextForWidth = textLongestLength <
  const isWarningTextBody = typeof warningText === "object" && warningText.body;

  return (
    <>
      <Popover>
        {({ open }) => (
          <>
            <Popover.Button
              css={[tw`grid place-items-center`]}
              as="div"
              ref={setReferenceElement}
            >
              {typeof children === "function"
                ? children({ isOpen: open })
                : children}
            </Popover.Button>
            <Popover.Panel
              css={[
                tw`z-50 transition-all duration-75 ease-in-out`,
                open ? tw`visible opacity-100` : tw`invisible opacity-0`,
              ]}
              style={styles.popper}
              ref={setPopperElement}
              {...attributes}
              static
            >
              {({ close }) => (
                <div css={[s.panelContainer]}>
                  <div
                    css={[
                      s.panelContent,
                      isWarningTextBody && tw`min-w-[55ch]`,
                    ]}
                  >
                    <div css={[tw`px-md pt-md flex gap-md pb-md`]}>
                      <div css={[tw`flex justify-center items-start`]}>
                        <span
                          css={[
                            tw`text-red-warning p-xs rounded-full bg-red-warning bg-opacity-10 text-2xl`,
                          ]}
                        >
                          <Warning weight="bold" />
                        </span>
                      </div>
                      {typeof warningText === "string" ? (
                        <h3 css={[s.heading]}>{warningText}</h3>
                      ) : (
                        <div>
                          <h3 css={[s.heading]}>{warningText.heading}</h3>
                          {warningText.body ? (
                            <p css={[tw`text-gray-600 text-sm`]}>
                              {warningText.body}
                            </p>
                          ) : null}
                        </div>
                      )}
                      <div></div>
                    </div>
                    <div css={[s.buttonsContainer]}>
                      <button
                        css={[
                          s.buttonDefault,
                          tw`border-gray-600 text-gray-700`,
                        ]}
                        onClick={() => close()}
                        type="button"
                      >
                        Cancel
                      </button>
                      <button
                        css={[
                          s.buttonDefault,
                          tw`border-gray-600 text-gray-700`,
                          proceedButtonStyles,
                        ]}
                        onClick={() => {
                          callbackToConfirm();
                          close();
                        }}
                        type="button"
                      >
                        Proceed
                      </button>
                    </div>
                  </div>
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

export default WithWarning;

const s = {
  panelContainer: tw`z-50 bg-white shadow-lg rounded-md`,
  panelContent: tw`min-w-[35ch]`,
  textContainer: tw`pt-lg pb-sm pl-lg min-w-[35ch] pr-lg`,
  heading: tw`flex font-medium text-lg items-center gap-sm mb-xs`,
  buttonsContainer: tw`flex justify-between items-center pl-lg pr-lg pb-sm pt-sm bg-gray-50 rounded-md`,
  buttonDefault: tw`py-1 px-2 border-2 rounded-md uppercase tracking-wide text-xs font-medium hover:bg-gray-100 bg-gray-50 transition-colors ease-in-out duration-75`,
};
