import { useState } from "react";
import tw from "twin.macro";
import { CaretDown, CaretUp } from "phosphor-react";

import useRelatedDocuments from "^hooks/authors/useRelatedDocuments";

import RelatedDocument from "^components/pages/catalog/_containers/RelatedDocument";

const RelatedDocumentsSection = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div>
      <div
        css={[tw`flex items-center gap-2xl cursor-pointer`]}
        onClick={() => setIsOpen(!isOpen)}
      >
        <h4 css={[tw`text-gray-600`]}>Related documents</h4>
        <span css={[tw`text-sm text-gray-500`]}>
          {isOpen ? <CaretUp /> : <CaretDown />}
        </span>
      </div>
      <div
        css={[
          isOpen
            ? tw`max-h-[400px] overflow-auto`
            : tw`max-h-0 overflow-hidden`,
          tw`transition-max-height ease-in-out`,
        ]}
      >
        <RelatedDocs />
      </div>
    </div>
  );
};

export default RelatedDocumentsSection;

const RelatedDocs = () => {
  const relatedDocuments = useRelatedDocuments();

  return (
    <div css={[tw`mt-xs flex flex-col gap-xs`]}>
      {[
        ...relatedDocuments.articles.defined,
        ...relatedDocuments.blogs.defined,
        ...relatedDocuments.recordedEvents.defined,
      ].map((doc) => (
        <RelatedDocument
          entity={{ id: doc.id, name: doc.type }}
          translations={doc.translations.map((t) => ({
            languageId: t.languageId,
            title: t.title,
          }))}
          key={doc.id}
        />
      ))}
    </div>
  );
};
