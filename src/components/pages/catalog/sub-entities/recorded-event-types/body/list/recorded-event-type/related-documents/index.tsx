import useRelatedDocuments from "^hooks/recorded-events-types/useRelatedDocuments";

import {
  $RelatedDocumentsSection,
  $RelatedDocuments_,
} from "^catalog-pages/_presentation";

const RelatedDocumentsSection = () => {
  const relatedDocuments = useRelatedDocuments();

  const relatedDocsArr = [...relatedDocuments.recordedEvents.defined];

  return (
    <$RelatedDocumentsSection title="Related documents">
      <$RelatedDocuments_
        relatedDocuments={relatedDocsArr.map((relatedDoc) => ({
          entity: { id: relatedDoc.id, name: relatedDoc.type },
          translations: relatedDoc.translations.map((t) => ({
            languageId: t.languageId,
            title: t.title,
          })),
        }))}
      />
    </$RelatedDocumentsSection>
  );
};

export default RelatedDocumentsSection;
