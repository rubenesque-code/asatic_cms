import { createContext, ReactElement, useContext } from "react";

import { useDispatch } from "^redux/hooks";
import { updateBodyTextContent } from "^redux/state/articles";

import { checkObjectHasField } from "^helpers/general";

import { BlogTextSection } from "^types/blog";
import { OmitFromMethods } from "^types/utilities";

const actionsInitial = {
  updateBodyTextContent,
};

type ActionsInitial = typeof actionsInitial;

type Actions = OmitFromMethods<
  ActionsInitial,
  "id" | "translationId" | "sectionId"
>;

type ContextValue = [section: BlogTextSection, actions: Actions];
const Context = createContext<ContextValue>([{}, {}] as ContextValue);

const BlogTextSectionProvider = ({
  children,
  translationId,
  blogId,
  section,
}: {
  children: ReactElement;
  translationId: string;
  blogId: string;
  section: BlogTextSection;
}) => {
  const { id: sectionId } = section;

  const dispatch = useDispatch();

  const sharedArgs = {
    id: blogId,
    translationId,
    sectionId,
  };

  const actions: Actions = {
    updateBodyTextContent: (args) =>
      dispatch(updateBodyTextContent({ ...sharedArgs, ...args })),
  };

  const value = [section, actions] as ContextValue;

  return <Context.Provider value={value}>{children}</Context.Provider>;
};

const useBlogTextSectionContext = () => {
  const context = useContext(Context);
  const contextIsEmpty = !checkObjectHasField(context[0]);
  if (contextIsEmpty) {
    throw new Error(
      "useBlogTextSectionContext must be used within its provider!"
    );
  }
  return context;
};

export { BlogTextSectionProvider, useBlogTextSectionContext };
