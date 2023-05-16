import { useRouter } from "next/router";
import { createContext, ReactElement, useContext } from "react";
import { ROUTES } from "^constants/routes";
import { checkObjectHasField } from "^helpers/general";

import { useDispatch, useSelector } from "^redux/hooks";
import {
  removeOne,
  togglePublishStatus,
  updatePublishDate,
  updateSaveDate,
  updateTitle,
  updateBannerImageSrc,
  updateBannerImageVertPosition,
  updateSummaryImageSrc,
  updateSummaryImageVertPosition,
  addRelatedEntity,
  removeRelatedEntity,
  updateDescription,
  updateSummaryText,
} from "^redux/state/collections";
import { selectCollectionStatus } from "^redux/state/complex-selectors/entity-status/collection";

import { Collection, CollectionStatus } from "^types/collection";
import { OmitFromMethods } from "^types/utilities";

// eslint-disable-next-line @typescript-eslint/no-empty-function
export default function CollectionSlice() {}

const actionsInitial = {
  addRelatedEntity,
  removeRelatedEntity,
  removeOne,
  togglePublishStatus,
  updatePublishDate,
  updateSaveDate,
  updateTitle,
  updateBannerImageSrc,
  updateBannerImageVertPosition,
  updateSummaryImageSrc,
  updateSummaryImageVertPosition,
  updateDescription,
  updateSummaryText,
};

type ActionsInitial = typeof actionsInitial;

type Actions = OmitFromMethods<ActionsInitial, "id"> & {
  routeToEditPage: () => void;
};
type ContextValue = [
  collection: Collection & {
    status: CollectionStatus;
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
  const { id } = collection;

  const status = useSelector((state) =>
    selectCollectionStatus(state, collection)
  );

  const dispatch = useDispatch();
  const router = useRouter();

  const actions: Actions = {
    addRelatedEntity: (args) => dispatch(addRelatedEntity({ id, ...args })),
    removeRelatedEntity: (args) =>
      dispatch(removeRelatedEntity({ id, ...args })),
    removeOne: () => dispatch(removeOne({ id })),
    togglePublishStatus: () => dispatch(togglePublishStatus({ id })),
    updatePublishDate: (args) => dispatch(updatePublishDate({ id, ...args })),
    updateSaveDate: (args) => dispatch(updateSaveDate({ id, ...args })),
    updateTitle: (args) => dispatch(updateTitle({ id, ...args })),
    updateDescription: (args) => dispatch(updateDescription({ id, ...args })),
    updateSummaryText: (args) => dispatch(updateSummaryText({ id, ...args })),
    updateBannerImageSrc: (args) =>
      dispatch(updateBannerImageSrc({ id, ...args })),
    updateBannerImageVertPosition: (args) =>
      dispatch(updateBannerImageVertPosition({ id, ...args })),
    updateSummaryImageSrc: (args) =>
      dispatch(updateSummaryImageSrc({ id, ...args })),
    updateSummaryImageVertPosition: (args) =>
      dispatch(updateSummaryImageVertPosition({ id, ...args })),
    routeToEditPage: () => router.push(`${ROUTES.COLLECTIONS.route}/${id}`),
  };

  return (
    <Context.Provider value={[{ ...collection, status }, actions]}>
      {typeof children === "function"
        ? children([{ ...collection, status }, actions])
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
