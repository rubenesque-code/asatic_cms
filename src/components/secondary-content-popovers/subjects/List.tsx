import SubjectSlice from "^context/subjects/SubjectContext";

import { useSelector } from "^redux/hooks";
import { selectLanguageById } from "^redux/state/languages";
import { selectSubjectById } from "^redux/state/subjects";

import PanelEntityUI from "../PanelEntityUI";
import PanelUI from "../PanelUI";

import { useDocSubjectsContext } from "./Panel";
import SubjectUI from "./SubjectUI";

import InlineTextEditor from "^components/editors/Inline";
import MissingText from "^components/MissingText";
import SubContentMissingFromStore from "^components/SubContentMissingFromStore";

const DocSubjectsList = () => {
  const { docSubjectsIds } = useDocSubjectsContext();

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
    <SubjectUI.Missing>
      <SubjectMenu subjectId={subjectId} />
    </SubjectUI.Missing>
  );
};

const SubjectMenu = ({ subjectId }: { subjectId: string }) => {
  const { removeSubjectFromDoc } = useDocSubjectsContext();

  return (
    <SubjectUI.Menu removeFromDoc={() => removeSubjectFromDoc(subjectId)} />
  );
};

const Subject = () => {
  const [{ id: subjectId }] = SubjectSlice.useContext();

  return (
    <PanelEntityUI menu={<SubjectMenu subjectId={subjectId} />}>
      <SubjectUI.DivideTranslations
        translationsOfDocLanguage={<TranslationsOfDocLanguage />}
        translationsNotOfDocLanguage={<TranslationsNotOfDocLanguage />}
      />
    </PanelEntityUI>
  );
};

const TranslationsOfDocLanguage = () => {
  const { docLanguagesIds } = useDocSubjectsContext();

  return (
    <SubjectUI.Translations>
      {docLanguagesIds.map((languageId, i) => (
        <TranslationOfDocLanguage
          index={i}
          docLanguageId={languageId}
          key={languageId}
        />
      ))}
    </SubjectUI.Translations>
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
    <SubjectUI.Translation
      isFirst={index !== 0}
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
    </SubjectUI.Translation>
  );
};

const TranslationsNotOfDocLanguage = () => {
  const { docLanguagesIds } = useDocSubjectsContext();
  const [{ translations }] = SubjectSlice.useContext();

  const translationsNotOfDocLanguage = translations.filter(
    (t) => !docLanguagesIds.includes(t.languageId)
  );

  return (
    <SubjectUI.Translations>
      {translationsNotOfDocLanguage.map((translation, i) => (
        <TranslationNotOfDocLanguage
          index={i}
          languageId={translation.languageId}
          text={translation.text}
          key={translation.id}
        />
      ))}
    </SubjectUI.Translations>
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
    <SubjectUI.Translation
      isFirst={index !== 0}
      ofDocLanguage={false}
      translationLanguage={<TranslationLanguage languageId={languageId} />}
    >
      {text?.length ? (
        text
      ) : (
        <MissingText tooltipText="missing subject translation" />
      )}
    </SubjectUI.Translation>
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
