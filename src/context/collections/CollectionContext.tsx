import { useRouter } from "next/router";
import { createContext, ReactElement, useContext } from "react";
import { ROUTES } from "^constants/routes";
import { checkObjectHasField, mapLanguageIds } from "^helpers/general";

import { useDispatch } from "^redux/hooks";
import {
  addSubject,
  addTag,
  addTranslation,
  removeOne,
  removeSubject,
  removeTag,
  togglePublishStatus,
  updateImage,
  updatePublishDate,
  updateSaveDate,
} from "^redux/state/collections";

import { Collection } from "^types/collection";
import { OmitFromMethods } from "^types/utilities";

const actionsInitial = {
  addSubject,
  addTag,
  addTranslation,
  removeOne,
  removeSubject,
  removeTag,
  togglePublishStatus,
  updateImage,
  updatePublishDate,
  updateSaveDate,
};

type ActionsInitial = typeof actionsInitial;

type Actions = OmitFromMethods<ActionsInitial, "id"> & {
  routeToEditPage: () => void;
};
type ContextValue = [
  collection: Collection & { languagesIds: string[] },
  actions: Actions
];
const Context = createContext<ContextValue>([{}, {}] as ContextValue);

const CollectionProvider = ({
  collection,
  children,
}: {
  collection: Collection;
  children: ReactElement;
}) => {
  const { id, translations } = collection;
  const languagesIds = mapLanguageIds(translations);

  const dispatch = useDispatch();
  const router = useRouter();

  const actions: Actions = {
    addSubject: (args) => dispatch(addSubject({ id, ...args })),
    addTag: (args) => dispatch(addTag({ id, ...args })),
    addTranslation: (args) => dispatch(addTranslation({ id, ...args })),
    removeOne: () => dispatch(removeOne({ id })),
    removeSubject: (args) => dispatch(removeSubject({ id, ...args })),
    removeTag: (args) => dispatch(removeTag({ id, ...args })),
    togglePublishStatus: () => dispatch(togglePublishStatus({ id })),
    updateImage: (args) => dispatch(updateImage({ id, ...args })),
    updatePublishDate: (args) => dispatch(updatePublishDate({ id, ...args })),
    updateSaveDate: (args) => dispatch(updateSaveDate({ id, ...args })),
    routeToEditPage: () => router.push(`${ROUTES.COLLECTIONS}/${id}`),
  };

  return (
    <Context.Provider value={[{ ...collection, languagesIds }, actions]}>
      {children}
    </Context.Provider>
  );
};

const useCollectionContext = () => {
  const context = useContext(Context);
  const contextIsPopulated = checkObjectHasField(context[0]);
  if (!contextIsPopulated) {
    throw new Error("useCollectionContext must be used within its provider!");
  }
  return context;
};

export { CollectionProvider, useCollectionContext };
