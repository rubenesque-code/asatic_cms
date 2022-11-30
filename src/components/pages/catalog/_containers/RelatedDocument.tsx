import { useState } from "react";
import tw from "twin.macro";

import {
  default_language_Id,
  second_default_language_Id,
} from "^constants/data";
import { EntityNameSubSet } from "^types/entity";

import HandleDocLanguage from "^components/handle-related-entity/Language";
import WithTooltip from "^components/WithTooltip";
import { DocumentEntityNameToIcon } from "^components/_containers/Icon_";
import { GoToPageIcon, TranslateIcon } from "^components/Icons";
import Link from "next/link";
import { EntityNameToRoute } from "^constants/routes";

type DocumentEntity = EntityNameSubSet<
  "article" | "blog" | "collection" | "recordedEvent" | "subject"
>;

const RelatedDocument = ({
  entity,
  translations,
}: {
  entity: {
    name: DocumentEntity;
    id: string;
  };
  translations: {
    title?: string;
    languageId: string;
  }[];
}) => {
  const [activeTranslation, setActiveTranslation] = useState(
    translations.find(
      (t) =>
        t.languageId === default_language_Id ||
        t.languageId === second_default_language_Id
    ) || translations[0]
  );

  return (
    <div css={[tw`flex items-center gap-xs max-w-full`]}>
      <div css={[tw`w-[2px] h-[18px] bg-gray-200`]} />
      <div css={[tw`text-gray-400 text-sm`]}>
        <DocumentEntityNameToIcon entityName={entity.name} />
      </div>
      <div css={[tw`flex gap-lg items-center flex-grow`]}>
        <WithTooltip text={activeTranslation.title || "no title"}>
          <div css={[tw`font-serif-eng max-w-[300px] truncate text-gray-800`]}>
            {activeTranslation.title?.length ? (
              activeTranslation.title
            ) : (
              <span css={[tw`text-gray-placeholder`]}>No title entered.</span>
            )}
          </div>
        </WithTooltip>
        <div css={[tw`flex gap-xs ml-xxs`]}>
          <span css={[tw`text-gray-300 text-sm`]}>
            <TranslateIcon />
          </span>
          <div css={[tw`flex gap-sm`]}>
            {translations.map((translation) => (
              <Language
                activeLanguageId={activeTranslation.languageId}
                languageId={translation.languageId}
                setActiveLanguageId={(languageId) =>
                  setActiveTranslation(
                    translations.find((t) => t.languageId === languageId)!
                  )
                }
                key={translation.languageId}
              />
            ))}
          </div>
        </div>
        <div
          css={[
            tw`text-gray-200 group-hover:text-gray-400 hover:text-gray-700 cursor-pointer ml-md transition-colors ease-in-out`,
          ]}
        >
          <Link
            href={`${EntityNameToRoute[entity.name]}/${entity.id}`}
            passHref
          >
            <div>
              <WithTooltip text="Go to page">
                <GoToPageIcon />
              </WithTooltip>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default RelatedDocument;

const Language = ({
  languageId,
  activeLanguageId,
  setActiveLanguageId,
}: {
  activeLanguageId: string;
  languageId: string;
  setActiveLanguageId: (languageId: string) => void;
}) => {
  const isSelected = languageId === activeLanguageId;

  return (
    <WithTooltip
      text="click to show this translation"
      isDisabled={isSelected}
      type="action"
    >
      <button
        css={[isSelected ? tw`text-gray-600` : tw`text-gray-400`]}
        onClick={() => setActiveLanguageId(languageId)}
        type="button"
      >
        <HandleDocLanguage languageId={languageId} />
      </button>
    </WithTooltip>
  );
};
