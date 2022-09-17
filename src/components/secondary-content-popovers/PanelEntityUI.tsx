import { Translate as TranslateIcon } from "phosphor-react";
import { ReactElement } from "react";
import tw from "twin.macro";
import ContentMenu from "^components/menus/Content";
import SubContentMissingFromStore from "^components/SubContentMissingFromStore";

function PanelEntityUI({
  children: translations,
  menu,
}: {
  children: ReactElement;
  menu: ReactElement;
}) {
  return (
    <div css={[tw`flex gap-sm`]} className="group">
      <div
        css={[
          tw`opacity-0 group-hover:opacity-100 transition-opacity duration-150 ease-in delay-300`,
        ]}
      >
        {menu}
      </div>
      <div
        css={[
          tw`translate-x-[-40px] group-hover:z-40 group-hover:translate-x-0 transition-transform duration-150 ease-in delay-300`,
        ]}
      >
        {translations}
      </div>
    </div>
  );
}

export default PanelEntityUI;

PanelEntityUI.Missing = function Missing({
  children: menu,
  subContentType,
}: {
  children: ReactElement;
  subContentType: string;
}) {
  return (
    <div css={[tw`flex items-center gap-sm`]}>
      {menu}
      <SubContentMissingFromStore subContentType={subContentType} />
    </div>
  );
};

PanelEntityUI.Menu = tw.div`flex items-center gap-sm`;

PanelEntityUI.DivideTranslations = function DivideTranslations({
  translationsOfDocLanguage,
  translationsNotOfDocLanguage,
}: {
  translationsOfDocLanguage: ReactElement;
  translationsNotOfDocLanguage: ReactElement | null;
}) {
  return (
    <div css={[tw`flex items-center gap-sm flex-wrap`]}>
      {translationsOfDocLanguage}
      {translationsNotOfDocLanguage ? (
        <>
          <div css={[tw`flex items-center gap-xxs ml-md`]}>
            <div css={[tw`h-[20px] w-[0.5px] bg-gray-200`]} />
            <div css={[tw`h-[20px] w-[0.5px] bg-gray-200`]} />
          </div>
          {translationsNotOfDocLanguage}
        </>
      ) : null}
    </div>
  );
};

PanelEntityUI.Translations = tw.div`flex gap-sm items-center`;

PanelEntityUI.Translation = function Translation({
  ofDocLanguage,
  isFirst,
  translationLanguage,
  children: translationText,
}: {
  ofDocLanguage: boolean;
  isFirst: boolean;
  translationLanguage: ReactElement;
  children: ReactElement | string;
}) {
  return (
    <div css={[tw`flex gap-sm items-center`]}>
      {!isFirst ? <ContentMenu.VerticalBar /> : null}
      <div
        css={[
          tw`flex gap-xs`,
          !ofDocLanguage && tw`pointer-events-none opacity-40`,
        ]}
      >
        <span>{translationText}</span>
        <p css={[tw`flex gap-xxxs items-center`]}>
          <span css={[tw`text-xs -translate-y-1 text-gray-500`]}>
            <TranslateIcon />
          </span>
          {translationLanguage}
        </p>
      </div>
    </div>
  );
};
