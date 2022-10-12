import { useRouter } from "next/router";
import { createContext, ReactElement, useContext } from "react";

import { useDispatch, useSelector } from "^redux/hooks";
import {
  addAuthor,
  addCollection,
  addSubject,
  addTag,
  addTranslation,
  removeAuthor,
  removeCollection,
  removeOne,
  removeSubject,
  removeTag,
  removeTranslation,
  togglePublishStatus,
  updatePublishDate,
  updateSaveDate,
  updateVideoSrc,
  updateLandingCustomImageAspectRatio,
  updateLandingCustomImageVertPosition,
  updateSummaryImageSrc,
  updateSummaryImageVertPosition,
  updateType,
} from "^redux/state/recordedEvents";
import { selectRecordedEventStatus } from "^redux/state/complex-selectors/recorded-events";

import { ROUTES } from "^constants/routes";

import { RecordedEvent } from "^types/recordedEvent";
import { OmitFromMethods } from "^types/utilities";

import { checkObjectHasField, mapLanguageIds } from "^helpers/general";
import { PrimaryEntityStatus } from "^types/primary-entity";

// eslint-disable-next-line @typescript-eslint/no-empty-function
export default function RecordedEventSlice() {}

const actionsInitial = {
  addAuthor,
  addCollection,
  addSubject,
  addTag,
  addTranslation,
  removeAuthor,
  removeCollection,
  removeSubject,
  removeTag,
  removeOne,
  removeTranslation,
  togglePublishStatus,
  updatePublishDate,
  updateSaveDate,
  updateLandingCustomImageAspectRatio,
  updateLandingCustomImageVertPosition,
  updateSummaryImageSrc,
  updateSummaryImageVertPosition,
  updateVideoSrc,
  updateType,
};
type ActionsInitial = typeof actionsInitial;

type Actions = OmitFromMethods<ActionsInitial, "id"> & {
  routeToEditPage: () => void;
};

type ContextValue = [
  recordedEvent: RecordedEvent & {
    languagesIds: string[];
    status: PrimaryEntityStatus;
  },
  actions: Actions
];

const Context = createContext<ContextValue>([{}, {}] as ContextValue);

RecordedEventSlice.Provider = function RecordedEventProvider({
  children,
  recordedEvent,
}: {
  recordedEvent: RecordedEvent;
  children: ReactElement | ((contextValue: ContextValue) => ReactElement);
}) {
  const { id, translations } = recordedEvent;
  const languagesIds = mapLanguageIds(translations);

  const status = useSelector((state) =>
    selectRecordedEventStatus(state, recordedEvent)
  );

  const dispatch = useDispatch();
  const router = useRouter();

  const actions: Actions = {
    addAuthor: ({ authorId }) => dispatch(addAuthor({ id, authorId })),
    addCollection: (args) => dispatch(addCollection({ id, ...args })),
    addSubject: (args) => dispatch(addSubject({ id, ...args })),
    addTag: ({ tagId }) => dispatch(addTag({ id, tagId })),
    addTranslation: ({ languageId }) =>
      dispatch(addTranslation({ id, languageId })),
    removeAuthor: ({ authorId }) => dispatch(removeAuthor({ authorId, id })),
    removeCollection: (args) => dispatch(removeCollection({ id, ...args })),
    removeOne: () => dispatch(removeOne({ id })),
    removeSubject: (args) => dispatch(removeSubject({ id, ...args })),
    removeTag: ({ tagId }) => dispatch(removeTag({ id, tagId })),
    togglePublishStatus: () => dispatch(togglePublishStatus({ id })),
    updatePublishDate: ({ date }) => dispatch(updatePublishDate({ date, id })),
    updateSaveDate: ({ date }) => dispatch(updateSaveDate({ date, id })),
    updateVideoSrc: (args) => dispatch(updateVideoSrc({ id, ...args })),
    removeTranslation: (args) => dispatch(removeTranslation({ id, ...args })),
    updateLandingCustomImageAspectRatio: (args) =>
      dispatch(updateLandingCustomImageAspectRatio({ id, ...args })),
    updateLandingCustomImageVertPosition: (args) =>
      dispatch(updateLandingCustomImageVertPosition({ id, ...args })),
    updateSummaryImageSrc: (args) =>
      dispatch(updateSummaryImageSrc({ id, ...args })),
    updateSummaryImageVertPosition: (args) =>
      dispatch(updateSummaryImageVertPosition({ id, ...args })),
    updateType: (args) => dispatch(updateType({ id, ...args })),
    routeToEditPage: () => router.push(`${ROUTES.RECORDEDEVENTS.route}/${id}`),
  };

  const value: ContextValue = [
    { ...recordedEvent, languagesIds, status },
    actions,
  ];

  return (
    <Context.Provider value={value}>
      {typeof children === "function" ? children(value) : children}
    </Context.Provider>
  );
};

RecordedEventSlice.useContext = function useRecordedEventContext() {
  const context = useContext(Context);
  const contextIsPopulated = checkObjectHasField(context[0]);
  if (!contextIsPopulated) {
    throw new Error(
      "useRecordedEventContext must be used within its provider!"
    );
  }
  return context;
};
