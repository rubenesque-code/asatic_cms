import { createContext, ReactElement, useContext } from "react";
import { checkObjectHasField } from "^helpers/general";
import { EntityNameSubSet } from "^types/entity";

type ParentType = EntityNameSubSet<"subject">;

export type ComponentContextValue = [
  {
    parentType: ParentType;
    excludedEntityIds: {
      articles: string[];
      blogs: string[];
      collections: string[];
      recordedEvents: string[];
    };
  },
  {
    addArticle: (articleId: string) => void;
    addBlog: (blogId: string) => void;
    addCollection: (collectionId: string) => void;
    addRecordedEvent: (recordedEventId: string) => void;
    closePopover: () => void;
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
      "useDisplayEntityPopoverComponentContext must be used within its provider!"
    );
  }
  return context;
}
