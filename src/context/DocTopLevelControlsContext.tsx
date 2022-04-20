import { createContext, ReactElement, useContext } from "react";

type Value = {
  isChangeInDoc: boolean;
  save: {
    func: () => void;
    isLoading: boolean;
    isError: boolean;
    isSuccess: boolean;
  };
  undo: {
    func: () => void;
  };
};

const Context = createContext<Value | null>(null);
const { Provider } = Context;

export const DocTopLevelControlsContext = ({
  children,
  save,
  undo,
  isChangeInDoc,
}: {
  children: ReactElement;
  save: Value["save"];
  undo: Value["undo"];
  isChangeInDoc: boolean;
}) => {
  const value: Value = {
    isChangeInDoc,
    save,
    undo,
  };
  return <Provider value={value}>{children}</Provider>;
};

export const useDocTopLevelControlsContext = () => {
  const context = useContext(Context);

  if (!context) {
    throw new Error(
      "useDocTopLevelControlsContext must be used within its provider"
    );
  }

  return context;
};
