import { createContext, ReactElement, useContext } from "react";

type Value = {
  isChange: boolean;
  save: {
    func: () => void;
    saveMutationData: Record<string, unknown> & {
      isError: boolean;
      isLoading: boolean;
      isSuccess: boolean;
    };
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
  isChange,
}: {
  children: ReactElement;
  save: Value["save"];
  undo: Value["undo"];
  isChange: boolean;
}) => {
  const value: Value = {
    isChange,
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
