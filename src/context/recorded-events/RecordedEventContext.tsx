import { useRouter } from "next/router";
import { createContext, ReactElement, useContext } from "react";

import { useDispatch, useSelector } from "^redux/hooks";
import {
  addTranslation,
  removeOne,
  removeTranslation,
  togglePublishStatus,
  updatePublishDate,
  updateSaveDate,
  updateVideoSrc,
  updateSummaryImageSrc,
  updateSummaryImageVertPosition,
  updateType,
  addRelatedEntity,
  removeRelatedEntity,
} from "^redux/state/recordedEvents";
import { selectRecordedEventStatus } from "^redux/state/complex-selectors/entity-status/recorded-event";

import { checkObjectHasField, mapLanguageIds } from "^helpers/general";

import { ROUTES } from "^constants/routes";

import { RecordedEvent, RecordedEventStatus } from "^types/recordedEvent";
import { OmitFromMethods } from "^types/utilities";

// eslint-disable-next-line @typescript-eslint/no-empty-function
export default function RecordedEventSlice() {}

const actionsInitial = {
  addTranslation,
  removeOne,
  removeTranslation,
  togglePublishStatus,
  updatePublishDate,
  updateSaveDate,
  updateSummaryImageSrc,
  updateSummaryImageVertPosition,
  updateVideoSrc,
  updateType,
  addRelatedEntity,
  removeRelatedEntity,
};
type ActionsInitial = typeof actionsInitial;

type Actions = OmitFromMethods<ActionsInitial, "id"> & {
  routeToEditPage: () => void;
};

type ContextValue = [
  recordedEvent: RecordedEvent & {
    languagesIds: string[];
    status: RecordedEventStatus;
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
    addRelatedEntity: (args) => dispatch(addRelatedEntity({ id, ...args })),
    removeRelatedEntity: (args) =>
      dispatch(removeRelatedEntity({ id, ...args })),
    addTranslation: (args) => dispatch(addTranslation({ id, ...args })),
    removeOne: () => dispatch(removeOne({ id })),
    togglePublishStatus: () => dispatch(togglePublishStatus({ id })),
    updatePublishDate: ({ date }) => dispatch(updatePublishDate({ date, id })),
    updateSaveDate: ({ date }) => dispatch(updateSaveDate({ date, id })),
    updateVideoSrc: (args) => dispatch(updateVideoSrc({ id, ...args })),
    removeTranslation: (args) => dispatch(removeTranslation({ id, ...args })),
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
