import { ReactElement } from "react";
import tw, { TwStyle } from "twin.macro";

import useToggle from "^hooks/useToggle";

import FixedOverlayCard from "./FixedOverlayCard";
import Overlay from "./Overlay";

const WithWarning = ({
  callbackToConfirm,
  children,
  proceedButtonStyles = tw`text-red-500 border-red-500`,
  warningText = {
    heading: "Are you sure?",
  },
}: {
  callbackToConfirm: () => void;
  children: ({ showWarning }: { showWarning: () => void }) => ReactElement;
  warningText?: {
    heading: string;
    body?: string;
  };
  proceedButtonStyles?: TwStyle;
}) => {
  const [show, setShowOn, setShowOff] = useToggle();

  const x = tw`border`;
  console.log(x);
  console.log(typeof x);

  return (
    <>
      <Overlay show={show} />
      {children({ showWarning: setShowOn })}
      <FixedOverlayCard onClickOutside={setShowOff} show={show}>
        <div className="grid gap-lg">
          <h3>{warningText.heading}</h3>
          {warningText.body ? <p>{warningText.body}</p> : null}
          <div className="flex items-center justify-between gap-md">
            <button
              css={[s.buttonDefault, tw`border-gray-600 text-gray-700`]}
              onClick={setShowOff}
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
                setShowOff();
              }}
              type="button"
            >
              Proceed
            </button>
          </div>
        </div>
      </FixedOverlayCard>
    </>
  );
};

export default WithWarning;

const s = {
  cardContentContainer: tw`grid gap-lg`,
  buttonDefault: tw`py-1 px-2 border uppercase tracking-wide text-xs rounded-sm `,
};
