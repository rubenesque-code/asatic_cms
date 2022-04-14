import { ReactElement } from "react";

import useToggle from "^hooks/useToggle";

import FixedOverlayCard from "./FixedOverlayCard";
import Overlay from "./Overlay";

const WithWarning = ({
  callbackToConfirm,
  children,
  proceedButtonBorderColor = "border-red-600",
  proceedButtonTextColor = "text-red-600",
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
  proceedButtonBorderColor?: string;
  proceedButtonTextColor?: string;
}) => {
  const [show, setShowOn, setShowOff] = useToggle();

  return (
    <>
      <Overlay show={show} />
      {children({ showWarning: setShowOn })}
      <FixedOverlayCard onClickOutside={setShowOff} show={show}>
        <div className="grid gap-lg">
          <h3>{warningText.heading}</h3>
          {warningText.body ? <p>{warningText.body}</p> : null}
          <div className="flex items-center justify-between gap-md">
            <Button
              onClick={setShowOff}
              borderColor="border-gray-600"
              textColor="text-gray-700"
            >
              Cancel
            </Button>
            <Button
              onClick={() => {
                callbackToConfirm();
                setShowOff();
              }}
              borderColor={proceedButtonBorderColor}
              textColor={proceedButtonTextColor}
            >
              Proceed
            </Button>
          </div>
        </div>
      </FixedOverlayCard>
    </>
  );
};

export default WithWarning;

const Button = ({
  children,
  onClick,
  borderColor,
  textColor,
}: {
  onClick: () => void;
  children: ReactElement | string;
  borderColor: string;
  textColor: string;
}) => (
  <button
    className={`py-1 px-2 border uppercase tracking-wide text-xs rounded-sm ${borderColor} ${textColor}`}
    onClick={onClick}
    type="button"
  >
    {children}
  </button>
);
