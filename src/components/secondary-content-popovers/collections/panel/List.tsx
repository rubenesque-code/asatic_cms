import { Books, FileMinus } from "phosphor-react";

import { useSelector } from "^redux/hooks";
import { selectLanguageById } from "^redux/state/languages";

import ListEntityUI from "../../ListEntityUI";
import PanelUI from "../../PanelUI";
import DocCollectionsPanel from ".";

import InlineTextEditor from "^components/editors/Inline";
import MissingText from "^components/MissingText";
import SubContentMissingFromStore from "^components/SubContentMissingFromStore";
import ContentMenu from "^components/menus/Content";
import { selectCollectionById } from "^redux/state/collections";
import CollectionSlice from "^context/collections/CollectionContext";
import DocSubjectsPopover from "^components/secondary-content-popovers/subjects";

const DocCollectionsList = () => {
  const { docCollectionsIds: docCollectionsIds } =
    DocCollectionsPanel.useContext();

  return (
    <PanelUI.List>
      {docCollectionsIds.map((collectionId, i) => (
        <PanelUI.ListItem number={i + 1} key={collectionId}>
          <DocCollection collectionId={collectionId} />
        </PanelUI.ListItem>
      ))}
    </PanelUI.List>
  );
};

export default DocCollectionsList;

const DocCollection = ({
  collectionId: collectionId,
}: {
  collectionId: string;
}) => {
  const collection = useSelector((state) =>
    selectCollectionById(state, collectionId)
  );

  return collection ? (
    <CollectionSlice.Provider collection={collection}>
      <Collection />
    </CollectionSlice.Provider>
  ) : (
    <MissingCollection collectionId={collectionId} />
  );
};

const MissingCollection = ({
  collectionId: collectionId,
}: {
  collectionId: string;
}) => {
  return (
    <ListEntityUI.Missing subContentType="collection">
      <MissingCollectionMenu collectionId={collectionId} />
    </ListEntityUI.Missing>
  );
};

const MissingCollectionMenu = ({ collectionId }: { collectionId: string }) => {
  return (
    <ListEntityUI.Menu>
      <RemoveCollectionFromDocButton collectionId={collectionId} />
    </ListEntityUI.Menu>
  );
};

const RemoveCollectionFromDocButton = ({
  collectionId,
}: {
  collectionId: string;
}) => {
  const { removeCollectionFromDoc } = DocCollectionsPanel.useContext();

  return (
    <ContentMenu.ButtonWithWarning
      tooltipProps={{ text: `remove collection from doc` }}
      warningProps={{
        callbackToConfirm: () => removeCollectionFromDoc(collectionId),
        warningText: "Remove collection from doc?",
        type: "moderate",
      }}
    >
      <FileMinus />
    </ContentMenu.ButtonWithWarning>
  );
};

const Collection = () => {
  return (
    <ListEntityUI menu={<CollectionMenu />}>
      <ListEntityUI.DivideTranslations
        translationsOfDocLanguage={<TranslationsOfDocLanguage />}
        translationsNotOfDocLanguage={<TranslationsNotOfDocLanguage />}
      />
    </ListEntityUI>
  );
};

const CollectionMenu = () => {
  const { docActiveLanguageId, docLanguagesIds } =
    DocCollectionsPanel.useContext();
  const [{ id: collectionId, subjectsIds }, { addSubject, removeSubject }] =
    CollectionSlice.useContext();

  return (
    <ListEntityUI.Menu>
      <RemoveCollectionFromDocButton collectionId={collectionId} />
      <DocSubjectsPopover
        addSubjectToDoc={(subjectId) => addSubject({ subjectId })}
        docActiveLanguageId={docActiveLanguageId}
        docLanguagesIds={docLanguagesIds}
        docSubjectsIds={subjectsIds}
        docType="collection"
        removeSubjectFromDoc={(subjectId) => removeSubject({ subjectId })}
      >
        <DocSubjectsPopover.Button
          docLanguagesIds={docLanguagesIds}
          docSubjectsIds={subjectsIds}
        >
          <ContentMenu.Button tooltipProps={{ text: "collection subjects" }}>
            <Books />
          </ContentMenu.Button>
        </DocSubjectsPopover.Button>
      </DocSubjectsPopover>
    </ListEntityUI.Menu>
  );
};

const TranslationsOfDocLanguage = () => {
  const { docLanguagesIds } = DocCollectionsPanel.useContext();

  return (
    <ListEntityUI.Translations>
      {docLanguagesIds.map((languageId, i) => (
        <TranslationOfDocLanguage
          index={i}
          docLanguageId={languageId}
          key={languageId}
        />
      ))}
    </ListEntityUI.Translations>
  );
};

const TranslationOfDocLanguage = ({
  index,
  docLanguageId,
}: {
  index: number;
  docLanguageId: string;
}) => {
  const [{ translations }, { addTranslation, updateTitle }] =
    CollectionSlice.useContext();

  const translation = translations.find((t) => t.languageId === docLanguageId);

  const handleUpdateText = (title: string) => {
    if (translation) {
      updateTitle({ translationId: translation.id, title });
    } else {
      // todo: got to here. Need to look into addtranslation abstraction
      addTranslation({ languageId: docLanguageId });
    }
  };

  return (
    <ListEntityUI.Translation
      isFirst={index === 0}
      ofDocLanguage={true}
      translationLanguage={<TranslationLanguage languageId={docLanguageId} />}
    >
      <InlineTextEditor
        injectedValue={translation?.title || ""}
        onUpdate={handleUpdateText}
        placeholder="collection..."
        minWidth={30}
      >
        {({ isFocused: isEditing }) => (
          <>
            {!translation?.title.length && !isEditing ? (
              <MissingText tooltipText="missing collection translation" />
            ) : null}
          </>
        )}
      </InlineTextEditor>
    </ListEntityUI.Translation>
  );
};

const TranslationsNotOfDocLanguage = () => {
  const { docLanguagesIds } = DocCollectionsPanel.useContext();
  const [{ translations }] = CollectionSlice.useContext();

  const translationsNotOfDocLanguage = translations.filter(
    (t) => !docLanguagesIds.includes(t.languageId)
  );

  return (
    <ListEntityUI.Translations>
      {translationsNotOfDocLanguage.map((translation, i) => (
        <TranslationNotOfDocLanguage
          index={i}
          languageId={translation.languageId}
          text={translation.text}
          key={translation.id}
        />
      ))}
    </ListEntityUI.Translations>
  );
};

const TranslationNotOfDocLanguage = ({
  index,
  languageId,
  text,
}: {
  index: number;
  languageId: string;
  text: string | null;
}) => {
  return (
    <ListEntityUI.Translation
      isFirst={index !== 0}
      ofDocLanguage={false}
      translationLanguage={<TranslationLanguage languageId={languageId} />}
    >
      {text?.length ? (
        text
      ) : (
        <MissingText tooltipText="missing subject translation" />
      )}
    </ListEntityUI.Translation>
  );
};

const TranslationLanguage = ({ languageId }: { languageId: string }) => {
  const language = useSelector((state) =>
    selectLanguageById(state, languageId)
  );

  return language ? (
    <>{language.name}</>
  ) : (
    <SubContentMissingFromStore subContentType="language" />
  );
};
