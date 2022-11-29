import { CaretDown, CaretUp } from "phosphor-react";
import { useState } from "react";
import tw from "twin.macro";
import AuthorSlice from "^context/authors/AuthorContext";
import useRelatedDocuments from "^hooks/authors/useRelatedDocuments";

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
        Related docs
      </div>
    </div>
  );
};

export default RelatedDocumentsSection;

const RelatedDocs = () => {
  const relatedDocuments = useRelatedDocuments();

  return;
};
