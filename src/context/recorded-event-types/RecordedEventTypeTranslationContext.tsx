import { createContext, ReactElement, useContext } from "react";
import { checkObjectHasField } from "^helpers/general";

import { useDispatch } from "^redux/hooks";
import { updateName } from "^redux/state/recordedEventsTypes";

import { RecordedEventTypeTranslation } from "^types/recordedEvent";
import { OmitFromMethods } from "^types/utilities";

// eslint-disable-next-line @typescript-eslint/no-empty-function
export default function RecordedEventTypeTranslationSlice() {}

const actionsInitial = {
  updateName,
};

type ActionsInitial = typeof actionsInitial;

type Actions = OmitFromMethods<ActionsInitial, "id">;

type ContextValue = [RecordedEventTypeTranslation, Actions];
const Context = createContext<ContextValue>([{}, {}] as ContextValue);

RecordedEventTypeTranslationSlice.Provider =
  function RecordedEventTypeTranslationProvider({
    recordedEventTypeId,
    translation,
    children,
  }: {
    recordedEventTypeId: string;
    translation: RecordedEventTypeTranslation;
    children: ReactElement | ((contextValue: ContextValue) => ReactElement);
  }) {
    const { id: translationId } = translation;
    const sharedArgs = {
      id: recordedEventTypeId,
      translationId,
    };

    const dispatch = useDispatch();

    const actions: Actions = {
      updateName: (args) => dispatch(updateName({ ...sharedArgs, ...args })),
    };

    return (
      <Context.Provider value={[translation, actions]}>
        {typeof children === "function"
          ? children([translation, actions])
          : children}
      </Context.Provider>
    );
  };

RecordedEventTypeTranslationSlice.useContext =
  function useRecordedEventTypeTranslationContext() {
    const context = useContext(Context);
    const contextIsPopulated = checkObjectHasField(context[0]);
    if (!contextIsPopulated) {
      throw new Error(
        "useRecordedEventTypeTranslationContext must be used within its provider!"
      );
    }
    return context;
  };
