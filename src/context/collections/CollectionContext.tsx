import { useRouter } from "next/router";
import { createContext, ReactElement, useContext } from "react";
import { ROUTES } from "^constants/routes";
import { checkObjectHasField, mapLanguageIds } from "^helpers/general";

import { useDispatch, useSelector } from "^redux/hooks";
import {
  addSubject,
  addTag,
  addTranslation,
  removeOne,
  removeSubject,
  removeTag,
  removeTranslation,
  togglePublishStatus,
  updateImageSrc,
  updatePublishDate,
  updateSaveDate,
  updateImageVertPosition,
  updateTitle,
  addRelatedContent,
  removeRelatedContent,
  updateAutoSectionImageVertPosition,
} from "^redux/state/collections";
import { selectCollectionStatus } from "^redux/state/complex-selectors/collections";

import { Collection } from "^types/collection";
import { DisplayContentStatus } from "^types/display-content";
import { OmitFromMethods } from "^types/utilities";

// eslint-disable-next-line @typescript-eslint/no-empty-function
export default function CollectionSlice() {}

const actionsInitial = {
  addSubject,
  addTag,
  addTranslation,
  removeOne,
  removeSubject,
  removeTag,
  removeTranslation,
  togglePublishStatus,
  updateImageSrc,
  updateImageVertPosition,
  updatePublishDate,
  updateSaveDate,
  updateTitle,
  addRelatedContent,
  removeRelatedContent,
  updateAutoSectionImageVertPosition,
};

type ActionsInitial = typeof actionsInitial;

type Actions = OmitFromMethods<ActionsInitial, "id"> & {
  routeToEditPage: () => void;
};
type ContextValue = [
  collection: Collection & {
    languagesIds: string[];
    status: DisplayContentStatus;
  },
  actions: Actions
];
const Context = createContext<ContextValue>([{}, {}] as ContextValue);

CollectionSlice.Provider = function CollectionProvider({
  collection,
  children,
}: {
  collection: Collection;
  children: ReactElement | ((contextValue: ContextValue) => ReactElement);
}) {
  const { id, translations } = collection;
  const languagesIds = mapLanguageIds(translations);

  const status = useSelector((state) =>
    selectCollectionStatus(state, collection)
  );

  const dispatch = useDispatch();
  const router = useRouter();

  const actions: Actions = {
    addSubject: (args) => dispatch(addSubject({ id, ...args })),
    addTag: (args) => dispatch(addTag({ id, ...args })),
    addTranslation: (args) => dispatch(addTranslation({ id, ...args })),
    removeOne: () => dispatch(removeOne({ id })),
    removeSubject: (args) => dispatch(removeSubject({ id, ...args })),
    removeTag: (args) => dispatch(removeTag({ id, ...args })),
    removeTranslation: (args) => dispatch(removeTranslation({ id, ...args })),
    togglePublishStatus: () => dispatch(togglePublishStatus({ id })),
    updateImageSrc: (args) => dispatch(updateImageSrc({ id, ...args })),
    updateImageVertPosition: (args) =>
      dispatch(updateImageVertPosition({ id, ...args })),
    updatePublishDate: (args) => dispatch(updatePublishDate({ id, ...args })),
    updateSaveDate: (args) => dispatch(updateSaveDate({ id, ...args })),
    updateTitle: (args) => dispatch(updateTitle({ id, ...args })),
    addRelatedContent: (args) => dispatch(addRelatedContent({ id, ...args })),

    removeRelatedContent: (args) =>
      dispatch(removeRelatedContent({ id, ...args })),
    updateAutoSectionImageVertPosition: (args) =>
      dispatch(updateAutoSectionImageVertPosition({ id, ...args })),
    routeToEditPage: () => router.push(`${ROUTES.COLLECTIONS}/${id}`),
  };

  return (
    <Context.Provider
      value={[{ ...collection, languagesIds, status }, actions]}
    >
      {typeof children === "function"
        ? children([{ ...collection, languagesIds, status }, actions])
        : children}
    </Context.Provider>
  );
};

CollectionSlice.useContext = function useCollectionContext() {
  const context = useContext(Context);
  const contextIsPopulated = checkObjectHasField(context[0]);
  if (!contextIsPopulated) {
    throw new Error("useCollectionContext must be used within its provider!");
  }
  return context;
};
