import { createContext, ReactElement, useContext } from "react";

import { useDispatch } from "^redux/hooks";
import {
  removeTranslation,
  updateBody,
  updateTitle,
} from "^redux/state/recordedEvents";

import { checkObjectHasField } from "^helpers/general";

import { RecordedEventTranslation as Translation } from "^types/recordedEvent";
import { OmitFromMethods } from "^types/utilities";

// eslint-disable-next-line @typescript-eslint/no-empty-function
export default function RecordedEventTranslationSlice() {}

const actionsInitial = {
  removeTranslation,
  updateBody,
  updateTitle,
};

type ActionsInitial = typeof actionsInitial;

type Actions = OmitFromMethods<ActionsInitial, "id" | "translationId">;

type ContextValue = [translation: Translation, actions: Actions];
const Context = createContext<ContextValue>([{}, {}] as ContextValue);

RecordedEventTranslationSlice.Provider =
  function RecordedEventTranslationProvider({
    children,
    translation,
    recordedEventId,
  }: {
    children: ReactElement;
    translation: Translation;
    recordedEventId: string;
  }) {
    const { id: translationId } = translation;

    const dispatch = useDispatch();

    const sharedArgs = {
      id: recordedEventId,
      translationId,
    };

    const actions: Actions = {
      removeTranslation: () => dispatch(removeTranslation({ ...sharedArgs })),
      updateBody: (args) => dispatch(updateBody({ ...sharedArgs, ...args })),
      updateTitle: (args) => dispatch(updateTitle({ ...sharedArgs, ...args })),
    };

    const value = [translation, actions] as ContextValue;

    return <Context.Provider value={value}>{children}</Context.Provider>;
  };

RecordedEventTranslationSlice.useContext =
  function useRecordedEventTranslationContext() {
    const context = useContext(Context);
    const contextIsEmpty = !checkObjectHasField(context[0]);
    if (contextIsEmpty) {
      throw new Error(
        "useRecordedEventTranslationContext must be used within its provider!"
      );
    }
    return context;
  };
