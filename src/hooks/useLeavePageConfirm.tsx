import { useEffect } from "react";
import Router from "next/router";
import { useBeforeUnload } from "react-use";

// todo: onLeavePage should be run in usebeforeunload too

export const useLeavePageConfirm = ({
  runConfirmOn,
  message = "Leave page? You will lose any unsaved changes!",
  onLeavePage,
}: {
  runConfirmOn: boolean;
  message?: string;
  onLeavePage?: () => void;
}): void => {
  // * below works for closing tab, etc.
  useBeforeUnload(runConfirmOn, message);

  // * below works for changing routes
  useEffect(() => {
    const handler = () => {
      if (runConfirmOn && !window.confirm(message)) {
        throw "Route Canceled";
      }

      onLeavePage && onLeavePage();
    };

    Router.events.on("routeChangeStart", handler);

    return () => {
      Router.events.off("routeChangeStart", handler);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [runConfirmOn]);
};
