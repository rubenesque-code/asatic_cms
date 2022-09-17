import { FileMinus } from "phosphor-react";

import AuthorSlice from "^context/authors/AuthorContext";

import { useSelector } from "^redux/hooks";
import { selectLanguageById } from "^redux/state/languages";
import { selectAuthorById } from "^redux/state/authors";

import ListEntityUI from "../../ListEntityUI";
import PanelUI from "../../PanelUI";
import DocAuthorsPanel from ".";

import InlineTextEditor from "^components/editors/Inline";
import MissingText from "^components/MissingText";
import SubContentMissingFromStore from "^components/SubContentMissingFromStore";
import ContentMenu from "^components/menus/Content";

const DocAuthorsList = () => {
  const { docAuthorsIds } = DocAuthorsPanel.useContext();

  return (
    <PanelUI.List>
      {docAuthorsIds.map((authorId, i) => (
        <PanelUI.ListItem number={i + 1} key={authorId}>
          <DocAuthor authorId={authorId} />
        </PanelUI.ListItem>
      ))}
    </PanelUI.List>
  );
};

export default DocAuthorsList;

const DocAuthor = ({ authorId }: { authorId: string }) => {
  const author = useSelector((state) => selectAuthorById(state, authorId));

  return author ? (
    <AuthorSlice.Provider author={author}>
      <Author />
    </AuthorSlice.Provider>
  ) : (
    <MissingAuthor authorId={authorId} />
  );
};

const MissingAuthor = ({ authorId: authorId }: { authorId: string }) => {
  return (
    <ListEntityUI.Missing subContentType="author">
      <AuthorMenu authorId={authorId} />
    </ListEntityUI.Missing>
  );
};

const AuthorMenu = ({ authorId }: { authorId: string }) => {
  const { removeAuthorFromDoc } = DocAuthorsPanel.useContext();

  return (
    <ListEntityUI.Menu>
      <ContentMenu.ButtonWithWarning
        tooltipProps={{ text: `remove author from doc` }}
        warningProps={{
          callbackToConfirm: () => removeAuthorFromDoc(authorId),
          warningText: "Remove author from doc?",
          type: "moderate",
        }}
      >
        <FileMinus />
      </ContentMenu.ButtonWithWarning>
    </ListEntityUI.Menu>
  );
};

const Author = () => {
  const [{ id: authorId }] = AuthorSlice.useContext();

  return (
    <ListEntityUI menu={<AuthorMenu authorId={authorId} />}>
      <ListEntityUI.DivideTranslations
        translationsOfDocLanguage={<TranslationsOfDocLanguage />}
        translationsNotOfDocLanguage={<TranslationsNotOfDocLanguage />}
      />
    </ListEntityUI>
  );
};

const TranslationsOfDocLanguage = () => {
  const { docLanguagesIds } = DocAuthorsPanel.useContext();

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
  const [{ translations }, { addTranslation, updateName }] =
    AuthorSlice.useContext();

  const translation = translations.find((t) => t.languageId === docLanguageId);

  const handleUpdateName = (name: string) => {
    if (translation) {
      updateName({ translationId: translation.id, name });
    } else {
      addTranslation({ languageId: docLanguageId, name });
    }
  };

  return (
    <ListEntityUI.Translation
      isFirst={index === 0}
      ofDocLanguage={true}
      translationLanguage={<TranslationLanguage languageId={docLanguageId} />}
    >
      <InlineTextEditor
        injectedValue={translation?.name || ""}
        onUpdate={handleUpdateName}
        placeholder="author..."
        minWidth={30}
      >
        {({ isFocused: isEditing }) => (
          <>
            {!translation?.name.length && !isEditing ? (
              <MissingText tooltipText="missing author translation" />
            ) : null}
          </>
        )}
      </InlineTextEditor>
    </ListEntityUI.Translation>
  );
};

const TranslationsNotOfDocLanguage = () => {
  const { docLanguagesIds } = DocAuthorsPanel.useContext();
  const [{ translations }] = AuthorSlice.useContext();

  const translationsNotOfDocLanguage = translations.filter(
    (t) => !docLanguagesIds.includes(t.languageId)
  );

  return (
    <ListEntityUI.Translations>
      {translationsNotOfDocLanguage.map((translation, i) => (
        <TranslationNotOfDocLanguage
          index={i}
          languageId={translation.languageId}
          text={translation.name}
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
        <MissingText tooltipText="missing author translation" />
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
