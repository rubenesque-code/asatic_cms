import useRelatedDocuments from "^hooks/tags/useRelatedDocuments";

import {
  $RelatedDocumentsSection,
  $RelatedDocuments_,
} from "^catalog-pages/_presentation";

const RelatedDocumentsSection = () => {
  const relatedDocuments = useRelatedDocuments();

  const relatedDocsArr = [
    ...relatedDocuments.articles.defined,
    ...relatedDocuments.blogs.defined,
    ...relatedDocuments.collections.defined,
    ...relatedDocuments.recordedEvents.defined,
    ...relatedDocuments.subjects.defined,
  ];

  return (
    <$RelatedDocumentsSection title="Tagged documents">
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
