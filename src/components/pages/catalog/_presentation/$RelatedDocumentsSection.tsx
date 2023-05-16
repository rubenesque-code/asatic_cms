import { ReactElement, useState } from "react";
import tw from "twin.macro";
import { CaretDown, CaretUp } from "phosphor-react";

export const $RelatedDocumentsSection = ({
  children: relatedDocuments,
  title,
}: {
  children: ReactElement;
  title: string;
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div>
      <div
        css={[tw`flex items-center gap-2xl cursor-pointer`]}
        onClick={() => setIsOpen(!isOpen)}
      >
        <h4 css={[tw`text-gray-600`]}>{title}</h4>
        <div css={[tw`flex items-center gap-xs`]}>
          <span css={[tw`text-sm text-gray-500`]}>
            {isOpen ? <CaretUp /> : <CaretDown />}
          </span>
          {!isOpen ? (
            <span
              css={[
                tw`text-gray-100 group-hover:text-gray-400 hover:text-gray-700 transition-colors ease-in-out uppercase text-xs`,
              ]}
            >
              Show
            </span>
          ) : null}
        </div>
      </div>
      <div
        css={[
          isOpen
            ? tw`max-h-[250px] overflow-auto`
            : tw`max-h-0 overflow-hidden`,
          tw`transition-max-height ease-in-out`,
        ]}
      >
        {relatedDocuments}
      </div>
    </div>
  );
};
