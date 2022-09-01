import { useSelector } from "^redux/hooks";
import { selectLanguageById } from "^redux/state/languages";
import { selectSubjectById } from "^redux/state/subjects";

import SubjectSlice from "^context/subjects/SubjectContext";

import InlineTextEditor from "^components/editors/Inline";
import MissingText from "^components/MissingText";
import SubContentMissingFromStore from "^components/SubContentMissingFromStore";
import { useComponentContext } from ".";
import SubjectUI from "./SubjectUI";

const SubjectAsListItem = ({ subjectId }: { subjectId: string }) => {
  const subject = useSelector((state) => selectSubjectById(state, subjectId));

  return subject ? (
    <SubjectSlice.Provider subject={subject}>
      <Subject />
    </SubjectSlice.Provider>
  ) : (
    <SubjectUI.Missing menu={<SubjectMenu subjectId={subjectId} />} />
  );
};

export default SubjectAsListItem;

const SubjectMenu = ({ subjectId }: { subjectId: string }) => {
  const { removeSubjectFromDoc } = useComponentContext();

  return (
    <SubjectUI.Menu removeFromDoc={() => removeSubjectFromDoc(subjectId)} />
  );
};

const Subject = () => {
  const [{ id: subjectId }] = SubjectSlice.useContext();

  return (
    <SubjectUI.Subject menu={<SubjectMenu subjectId={subjectId} />}>
      <SubjectUI.DivideTranslations
        translationsOfDocLanguage={<TranslationsOfDocLanguage />}
        translationsNotOfDocLanguage={<TranslationsNotOfDocLanguage />}
      />
    </SubjectUI.Subject>
  );
};

const TranslationsOfDocLanguage = () => {
  const { docLanguagesIds } = useComponentContext();

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
  const { docLanguagesIds } = useComponentContext();
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
