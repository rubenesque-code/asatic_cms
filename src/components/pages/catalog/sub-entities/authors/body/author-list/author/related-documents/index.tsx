import useRelatedDocuments from "^hooks/authors/useRelatedDocuments";

import {
  $RelatedDocumentsSection,
  $RelatedDocuments_,
} from "^catalog-pages/_presentation";

const RelatedDocumentsSection = () => {
  const relatedDocuments = useRelatedDocuments();

  const relatedDocsArr = [
    ...relatedDocuments.articles.defined,
    ...relatedDocuments.blogs.defined,
    ...relatedDocuments.recordedEvents.defined,
  ];

  return (
    <$RelatedDocumentsSection title="Authored documents">
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
