import { FileMinus, Translate } from "phosphor-react";
import { ReactElement } from "react";
import tw from "twin.macro";
import ContentMenu from "^components/menus/Content";
import SubContentMissingFromStore from "^components/SubContentMissingFromStore";

export default function PanelUI({ children }: { children: ReactElement }) {
  return (
    <div
      css={[
        tw`min-w-[800px] max-w-[94vw] p-md bg-white shadow-lg rounded-md border`,
      ]}
    >
      {children}
    </div>
  );
}

PanelUI.DescriptionSkeleton = function DescriptionSkeleton({
  areSubDocs,
  description,
  docType,
  subDocType,
  title,
}: {
  title: string;
  description: string;
  docType: string;
  subDocType: string;
  areSubDocs: boolean;
}) {
  return (
    <div>
      <h4 css={[tw`font-medium text-lg`]}>{title}</h4>
      <p css={[tw`text-gray-600 mt-xs text-sm`]}>{description}</p>
      {!areSubDocs ? (
        <p css={[tw`text-gray-800 mt-sm text-sm`]}>
          This {docType} isn&apos;t related to a {subDocType} yet.
        </p>
      ) : (
        <p css={[tw`mt-md text-sm `]}>
          This {docType} is related to the following {subDocType}(s):
        </p>
      )}
    </div>
  );
};

PanelUI.List = function List({
  children: listItems,
}: {
  children: ReactElement[];
}) {
  return <div css={[tw`flex flex-col gap-md mt-md`]}>{listItems}</div>;
};

PanelUI.ListItem = function ListItem({
  children,
  number,
}: {
  children: ReactElement;
  number: number;
}) {
  return (
    <div css={[tw`relative flex`]} className="group">
      <span css={[tw`text-gray-600 mr-sm`]}>{number}.</span>
      {children}
    </div>
  );
};

PanelUI.InputSelectCombo = tw.div`mt-lg`;

PanelUI.MissingEntity = function MissingEntity({
  children: menu,
  docType,
}: {
  children: ReactElement;
  docType: string;
}) {
  return (
    <div css={[tw`flex items-center gap-sm`]}>
      {menu}
      <SubContentMissingFromStore subContentType={docType} />
    </div>
  );
};

PanelUI.EntityMenu = function EntityMenu({
  docType,
  removeFromDoc,
}: {
  removeFromDoc: () => void;
  docType: string;
}) {
  return (
    <div css={[tw`flex items-center gap-xs`]}>
      <ContentMenu.ButtonWithWarning
        tooltipProps={{ text: `remove ${docType} from doc` }}
        warningProps={{
          callbackToConfirm: removeFromDoc,
          warningText: "Remove from doc?",
        }}
      >
        <FileMinus />
      </ContentMenu.ButtonWithWarning>
      <ContentMenu.VerticalBar />
    </div>
  );
};

PanelUI.Entity = function Entity({ children }: { children: ReactElement }) {
  return (
    <div css={[tw`flex gap-sm`]} className="group">
      {children}
    </div>
  );
};

PanelUI.ValidEntityMenuWrapper = tw.div`opacity-0 group-hover:opacity-100 transition-opacity duration-150 ease-in delay-300`;

PanelUI.EntityTranslationsWrapper = tw.div`translate-x-[-40px] group-hover:z-40 group-hover:translate-x-0 transition-transform duration-150 ease-in delay-300`;

PanelUI.DivideEntityTranslations = function DivideTranslations({
  docLanguageTranslations,
  nonDocLanguageTranslations,
}: {
  docLanguageTranslations: ReactElement[];
  nonDocLanguageTranslations: ReactElement[];
}) {
  return (
    <div css={[tw`flex items-center gap-sm flex-wrap`]}>
      <Translations translations={docLanguageTranslations} />
      {nonDocLanguageTranslations.length ? (
        <>
          <div css={[tw`flex items-center gap-xxs ml-md`]}>
            <div css={[tw`h-[20px] w-[0.5px] bg-gray-200`]} />
            <div css={[tw`h-[20px] w-[0.5px] bg-gray-200`]} />
          </div>
          {<Translations translations={nonDocLanguageTranslations} />}
        </>
      ) : null}
    </div>
  );
};

function Translations({ translations }: { translations: ReactElement[] }) {
  return (
    <>
      {translations.map((translation, i) => (
        <div css={tw`flex gap-sm items-center`} key={i}>
          {i !== 0 ? <ContentMenu.VerticalBar /> : null}
          {translation}
        </div>
      ))}
    </>
  );
}

PanelUI.EntityTranslation = function EntityTranslation({
  isDocLanguage,
  language,
  translationText,
}: {
  isDocLanguage: boolean;
  language: ReactElement;
  translationText: ReactElement | string;
}) {
  return (
    <div
      css={[
        tw`flex gap-xs`,
        !isDocLanguage && tw`pointer-events-none opacity-40`,
      ]}
    >
      <span>{translationText}</span>
      {language}
    </div>
  );
};

PanelUI.TranslationLanguage = function TranslationLanguage({
  languageText,
}: {
  languageText: string | null;
}) {
  return (
    <p css={[tw`flex gap-xxxs items-center`]}>
      <span css={[tw`text-xs -translate-y-1 text-gray-500`]}>
        <Translate />
      </span>
      {languageText ? (
        <span css={[tw`text-gray-600 text-sm`]}>{languageText}</span>
      ) : (
        <SubContentMissingFromStore subContentType="language" />
      )}
    </p>
  );
};
