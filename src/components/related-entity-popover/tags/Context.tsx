import { createContext, ReactElement, useContext } from "react";
import { checkObjectHasField } from "^helpers/general";

export type ComponentContextValue = [
  {
    parentTagsIds: string[];
    parentType: string;
  },
  {
    addTagToParent: (tagId: string) => void;
    removeTagFromParent: (tagId: string) => void;
  }
];

const ComponentContext = createContext<ComponentContextValue>([
  {},
  {},
] as ComponentContextValue);

export function ComponentProvider({
  children,
  parentActions,
  parentData,
}: {
  children: ReactElement;
  parentData: ComponentContextValue[0];
  parentActions: ComponentContextValue[1];
}) {
  return (
    <ComponentContext.Provider value={[parentData, parentActions]}>
      {children}
    </ComponentContext.Provider>
  );
}

export function useComponentContext() {
  const context = useContext(ComponentContext);
  const contextIsPopulated = checkObjectHasField(context[0]);
  if (!contextIsPopulated) {
    throw new Error(
      "useTagsPopoverComponentContext must be used within its provider!"
    );
  }
  return context;
}
