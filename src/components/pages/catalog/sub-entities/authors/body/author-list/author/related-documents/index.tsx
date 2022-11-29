import { CaretDown, CaretUp } from "phosphor-react";
import { useState } from "react";
import tw from "twin.macro";

const RelatedDocuments = () => {
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
          isOpen ? tw`max-h-[400px]` : tw`max-h-0`,
          tw`overflow-hidden transition-max-height ease-in-out`,
        ]}
      >
        Related docs
      </div>
    </div>
  );
};

export default RelatedDocuments;
