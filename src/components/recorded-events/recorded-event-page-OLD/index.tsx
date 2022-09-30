import { ReactElement } from "react";

import { useSelector } from "^redux/hooks";

import useGetSubRouteId from "^hooks/useGetSubRouteId";
import { useLeavePageConfirm } from "^hooks/useLeavePageConfirm";

import RecordedEventSlice from "^context/recorded-events/RecordedEventContext";

import ContainersUI from "./ContainersUI";
import HeaderUnpopulated from "./Header";
import RecordedEventUI from "./RecordedEventUI";
import RecordedEventBody from "./RecordedEventBody";

import DocLanguages from "^components/DocLanguages";
import DocAuthorsText from "^components/authors/DocAuthorsText";
import InlineTextEditor from "^components/editors/Inline";
import { selectRecordedEventById } from "^redux/state/recordedEvents";
import RecordedEventTranslationSlice from "^context/recorded-events/RecordedEventTranslationContext";
import useRecordedEventsPageTopControls from "^hooks/pages/useRecordedEventPageTopControls";

const PageContent = () => {
  return (
    <ContainersUI.ScreenHeight>
      <Providers>
        <>
          <Header />
          <ContainersUI.Canvas>
            <RecordedEvent />
          </ContainersUI.Canvas>
        </>
      </Providers>
    </ContainersUI.ScreenHeight>
  );
};

export default PageContent;

const Providers = ({ children }: { children: ReactElement }) => {
  const recordedEventId = useGetSubRouteId();
  const recordedEvent = useSelector((state) =>
    selectRecordedEventById(state, recordedEventId)
  )!;

  return (
    <RecordedEventSlice.Provider recordedEvent={recordedEvent}>
      {([{ languagesIds: recordedEventsLanguagesIds, translations }]) => (
        <DocLanguages.Provider docLanguagesIds={recordedEventsLanguagesIds}>
          {({ activeLanguageId }) => (
            <RecordedEventTranslationSlice.Provider
              recordedEventId={recordedEventId}
              translation={
                translations.find((t) => t.languageId === activeLanguageId)!
              }
            >
              {children}
            </RecordedEventTranslationSlice.Provider>
          )}
        </DocLanguages.Provider>
      )}
    </RecordedEventSlice.Provider>
  );
};

const Header = () => {
  const {
    handleSave: save,
    handleUndo: undo,
    isChange,
    saveMutationData: { isError, isLoading, isSuccess },
  } = useRecordedEventsPageTopControls();

  useLeavePageConfirm({ runConfirmOn: isChange });

  return (
    <HeaderUnpopulated
      isChange={isChange}
      save={save}
      saveMutationData={{
        isError,
        isLoading,
        isSuccess,
      }}
      undo={undo}
    />
  );
};

const RecordedEvent = () => {
  return (
    <RecordedEventUI>
      <>
        <RecordedEventUI.Header>
          <RecordedEventUI.RecordedEventTitle>
            Asatic Talks & Interviews
          </RecordedEventUI.RecordedEventTitle>
          <Title />
          <Authors />
        </RecordedEventUI.Header>
        <RecordedEventBody />
      </>
    </RecordedEventUI>
  );
};

const Title = () => {
  const [{ id: translationId, title }, { updateTitle }] =
    RecordedEventTranslationSlice.useContext();

  return (
    <RecordedEventUI.Title>
      <InlineTextEditor
        injectedValue={title || ""}
        onUpdate={(title) => updateTitle({ title })}
        placeholder="Title"
        key={translationId}
      />
    </RecordedEventUI.Title>
  );
};

const Authors = () => {
  const [{ authorsIds }] = RecordedEventSlice.useContext();
  const [{ activeLanguageId }] = DocLanguages.useContext();

  return (
    <RecordedEventUI.Authors>
      <DocAuthorsText
        authorIds={authorsIds}
        docActiveLanguageId={activeLanguageId}
      />
    </RecordedEventUI.Authors>
  );
};
