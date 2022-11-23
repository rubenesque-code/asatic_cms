import { createContext, ReactElement, useContext } from "react";

import { useDispatch } from "^redux/hooks";
import { updateBodyText } from "^redux/state/blogs";

import { checkObjectHasField } from "^helpers/general";

import { OmitFromMethods } from "^types/utilities";
import { TextSection } from "^types/article-like-entity";

// eslint-disable-next-line @typescript-eslint/no-empty-function
export default function BlogTextSectionSlice() {}

const actionsInitial = {
  updateBodyText,
};

type ActionsInitial = typeof actionsInitial;

type Actions = OmitFromMethods<
  ActionsInitial,
  "id" | "translationId" | "sectionId"
>;

type ContextValue = [section: TextSection, actions: Actions];
const Context = createContext<ContextValue>([{}, {}] as ContextValue);

BlogTextSectionSlice.Provider = function BlogTextSectionProvider({
  children,
  translationId,
  blogId,
  section,
}: {
  children: ReactElement;
  translationId: string;
  blogId: string;
  section: TextSection;
}) {
  const { id: sectionId } = section;

  const dispatch = useDispatch();

  const sharedArgs = {
    id: blogId,
    translationId,
    sectionId,
  };

  const actions: Actions = {
    updateBodyText: (args) =>
      dispatch(updateBodyText({ ...sharedArgs, ...args })),
  };

  const value = [section, actions] as ContextValue;

  return <Context.Provider value={value}>{children}</Context.Provider>;
};

BlogTextSectionSlice.useContext = function useBlogTextSectionContext() {
  const context = useContext(Context);
  const contextIsEmpty = !checkObjectHasField(context[0]);
  if (contextIsEmpty) {
    throw new Error(
      "useBlogTextSectionContext must be used within its provider!"
    );
  }
  return context;
};
