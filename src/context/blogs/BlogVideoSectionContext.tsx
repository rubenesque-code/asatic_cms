import { createContext, ReactElement, useContext } from "react";

import { useDispatch } from "^redux/hooks";
import { updateBodyVideoCaption, updateBodyVideoSrc } from "^redux/state/blogs";

import { checkObjectHasField } from "^helpers/general";

import { ArticleLikeVideoSection } from "^types/article-like-entity";
import { OmitFromMethods } from "^types/utilities";

// eslint-disable-next-line @typescript-eslint/no-empty-function
export default function BlogVideoSectionSlice() {}

const actionsInitial = {
  updateBodyVideoCaption,
  updateBodyVideoSrc,
};

type ActionsInitial = typeof actionsInitial;

type Actions = OmitFromMethods<
  ActionsInitial,
  "id" | "translationId" | "sectionId"
>;

type ContextValue = [section: ArticleLikeVideoSection, actions: Actions];
const Context = createContext<ContextValue>([{}, {}] as ContextValue);

BlogVideoSectionSlice.Provider = function BlogVideoSectionProvider({
  children,
  translationId,
  blogId,
  section,
}: {
  children: ReactElement;
  translationId: string;
  blogId: string;
  section: ArticleLikeVideoSection;
}) {
  const { id: sectionId } = section;

  const sharedArgs = {
    id: blogId,
    translationId,
    sectionId,
  };

  const dispatch = useDispatch();

  const actions: Actions = {
    updateBodyVideoCaption: (args) =>
      dispatch(updateBodyVideoCaption({ ...sharedArgs, ...args })),
    updateBodyVideoSrc: (args) =>
      dispatch(updateBodyVideoSrc({ ...sharedArgs, ...args })),
  };

  const value = [section, actions] as ContextValue;

  return <Context.Provider value={value}>{children}</Context.Provider>;
};

BlogVideoSectionSlice.useContext = function useBlogVideoSectionContext() {
  const context = useContext(Context);
  const contextIsEmpty = !checkObjectHasField(context[0]);
  if (contextIsEmpty) {
    throw new Error(
      "useBlogVideoSectionContext must be used within its provider!"
    );
  }
  return context;
};
