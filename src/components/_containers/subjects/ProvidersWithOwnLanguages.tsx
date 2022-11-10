import { ReactElement } from "react";

import SubjectSlice from "^context/subjects/SubjectContext";
import SubjectTranslationSlice from "^context/subjects/SubjectTranslationContext";

import { Subject } from "^types/subject";

import DocLanguages from "^components/DocLanguages";

const ProvidersWithOwnLanguages = ({
  subject,
  children,
}: {
  subject: Subject;
  children: ReactElement;
}) => {
  return (
    <SubjectSlice.Provider subject={subject}>
      {([{ id: collectionId, languagesIds, translations }]) => (
        <DocLanguages.Provider docLanguagesIds={languagesIds}>
          {({ activeLanguageId }) => (
            <SubjectTranslationSlice.Provider
              subjectId={collectionId}
              translation={
                translations.find((t) => t.languageId === activeLanguageId)!
              }
            >
              {children}
            </SubjectTranslationSlice.Provider>
          )}
        </DocLanguages.Provider>
      )}
    </SubjectSlice.Provider>
  );
};

export default ProvidersWithOwnLanguages;
