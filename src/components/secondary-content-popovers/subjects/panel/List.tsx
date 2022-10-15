import { FileMinus } from "phosphor-react";

import SubjectSlice from "^context/subjects/SubjectContext";

import { useSelector } from "^redux/hooks";
import { selectLanguageById } from "^redux/state/languages";
import { selectSubjectById } from "^redux/state/subjects";

import ListEntityUI from "../../ListEntityUI";
import PanelUI from "../../PanelUI";
import DocSubjectsPanel from ".";

import InlineTextEditor from "^components/editors/Inline";
import MissingText from "^components/MissingText";
import SubContentMissingFromStore from "^components/SubContentMissingFromStore";
import ContentMenu from "^components/menus/Content";

const DocSubjectsList = () => {
  const { docSubjectsIds } = DocSubjectsPanel.useContext();

  return (
    <PanelUI.List>
      {docSubjectsIds.map((subjectId, i) => (
        <PanelUI.ListItem number={i + 1} key={subjectId}>
          <DocSubject subjectId={subjectId} />
        </PanelUI.ListItem>
      ))}
    </PanelUI.List>
  );
};

export default DocSubjectsList;

const DocSubject = ({ subjectId }: { subjectId: string }) => {
  const subject = useSelector((state) => selectSubjectById(state, subjectId));

  return subject ? (
    <SubjectSlice.Provider subject={subject}>
      <Subject />
    </SubjectSlice.Provider>
  ) : (
    <MissingSubject subjectId={subjectId} />
  );
};

const MissingSubject = ({ subjectId }: { subjectId: string }) => {
  return (
    <ListEntityUI.Missing subContentType="subject">
      <SubjectMenu subjectId={subjectId} />
    </ListEntityUI.Missing>
  );
};

const SubjectMenu = ({ subjectId }: { subjectId: string }) => {
  const { removeSubjectFromDoc } = DocSubjectsPanel.useContext();

  return (
    <ListEntityUI.Menu>
      <ContentMenu.ButtonWithWarning
        tooltipProps={{ text: `remove subject from doc` }}
        warningProps={{
          callbackToConfirm: () => removeSubjectFromDoc(subjectId),
          warningText: "Remove subject from doc?",
          type: "moderate",
        }}
      >
        <FileMinus />
      </ContentMenu.ButtonWithWarning>
    </ListEntityUI.Menu>
  );
};

const Subject = () => {
  const [{ id: subjectId }] = SubjectSlice.useContext();

  return (
    <ListEntityUI menu={<SubjectMenu subjectId={subjectId} />}>
      <ListEntityUI.DivideTranslations
        translationsOfDocLanguage={<TranslationsOfDocLanguage />}
        translationsNotOfDocLanguage={<TranslationsNotOfDocLanguage />}
      />
    </ListEntityUI>
  );
};

const TranslationsOfDocLanguage = () => {
  const { docLanguagesIds } = DocSubjectsPanel.useContext();

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
  const [{ translations }, { addTranslation, updateText }] =
    SubjectSlice.useContext();

  const translation = translations.find((t) => t.languageId === docLanguageId);

  const handleUpdateText = (text: string) => {
    if (translation) {
      updateText({ translationId: translation.id, text });
    } else {
      addTranslation({ languageId: docLanguageId, text });
    }
  };

  return (
    <ListEntityUI.Translation
      isFirst={index === 0}
      ofDocLanguage={true}
      translationLanguage={<TranslationLanguage languageId={docLanguageId} />}
    >
      <InlineTextEditor
        injectedValue={translation?.text || ""}
        onUpdate={handleUpdateText}
        placeholder="subject..."
        minWidth={30}
      >
        {({ isFocused: isEditing }) => (
          <>
            {!translation?.text.length && !isEditing ? (
              <MissingText tooltipText="missing subject translation" />
            ) : null}
          </>
        )}
      </InlineTextEditor>
    </ListEntityUI.Translation>
  );
};

const TranslationsNotOfDocLanguage = () => {
  const { docLanguagesIds } = DocSubjectsPanel.useContext();
  const [{ translations }] = SubjectSlice.useContext();

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
