import { ReactElement } from "react";
import { EntityLanguageProvider } from "^context/EntityLanguages";

import SubjectSlice from "^context/subjects/SubjectContext";
import SubjectTranslationSlice from "^context/subjects/SubjectTranslationContext";

import { Subject } from "^types/subject";

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
        <EntityLanguageProvider entity={{ languagesIds }}>
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
        </EntityLanguageProvider>
      )}
    </SubjectSlice.Provider>
  );
};

export default ProvidersWithOwnLanguages;
