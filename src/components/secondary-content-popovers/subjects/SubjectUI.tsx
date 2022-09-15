import { FileMinus, Translate as TranslateIcon } from "phosphor-react";
import { ReactElement } from "react";
import tw from "twin.macro";
import ContentMenu from "^components/menus/Content";
import SubContentMissingFromStore from "^components/SubContentMissingFromStore";

// eslint-disable-next-line @typescript-eslint/no-empty-function
export default function SubjectUI() {}

SubjectUI.Missing = function Missing({ menu }: { menu: ReactElement }) {
  return (
    <div css={[tw`flex items-center gap-sm`]}>
      {menu}
      <SubContentMissingFromStore subContentType="subject" />
    </div>
  );
};

SubjectUI.Menu = function Menu({
  removeFromDoc,
}: {
  removeFromDoc: () => void;
}) {
  return (
    <ContentMenu show={true}>
      <ContentMenu.ButtonWithWarning
        tooltipProps={{ text: `remove subject from doc` }}
        warningProps={{
          callbackToConfirm: removeFromDoc,
          warningText: "Remove subject from doc?",
        }}
      >
        <FileMinus />
      </ContentMenu.ButtonWithWarning>
    </ContentMenu>
  );
};

SubjectUI.Subject = function Subject({
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
};

SubjectUI.DivideTranslations = function DivideTranslations({
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

SubjectUI.Translations = tw.div`flex gap-sm items-center`;

SubjectUI.Translation = function Translation({
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
