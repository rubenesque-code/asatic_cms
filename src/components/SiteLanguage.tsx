import { createContext, ReactElement, useContext, useState } from "react";
import { RadioGroup } from "@headlessui/react";
import { Check as CheckIcon, Translate as TranslateIcon } from "phosphor-react";
import tw from "twin.macro";

import { useSelector } from "^redux/hooks";
import { selectLanguageById } from "^redux/state/languages";

import { checkObjectHasField } from "^helpers/general";

import { siteLanguageIds } from "^constants/data";

import { siteLanguageIdsArr } from "^constants/data";

import WithProximityPopover from "^components/WithProximityPopover";
import WithTooltip from "^components/WithTooltip";

import s_button from "^styles/button";
import { s_popover } from "^styles/popover";

// eslint-disable-next-line @typescript-eslint/no-empty-function
export default function SiteLanguage() {}

type SiteLanguagesIds = typeof siteLanguageIds;
type SiteLanguageId = SiteLanguagesIds[keyof SiteLanguagesIds];

type ContextValue = [
  siteLanguage: { siteLanguageId: SiteLanguageId },
  actions: {
    setSiteLanguageId: (languageId: SiteLanguageId) => void;
  }
];
const Context = createContext<ContextValue>([{}, {}] as ContextValue);

SiteLanguage.Provider = function SiteLanguageProvider({
  children,
}: {
  children:
    | ReactElement
    | (({ siteLanguageId }: { siteLanguageId: string }) => ReactElement);
}) {
  const [siteLanguageId, setSiteLanguageId] = useState<SiteLanguageId>(
    siteLanguageIds["english"]
  );

  return (
    <Context.Provider value={[{ siteLanguageId }, { setSiteLanguageId }]}>
      {typeof children === "function" ? children({ siteLanguageId }) : children}
    </Context.Provider>
  );
};

const useSiteLanguageContext = () => {
  const context = useContext(Context);
  const contextIsPopulated = checkObjectHasField(context[0]);
  if (!contextIsPopulated) {
    throw new Error("useSiteLanguageContext must be used within its provider!");
  }

  return context;
};

SiteLanguage.useContext = function useSiteLanguageContext() {
  const [{ siteLanguageId }] = useContext(Context);
  const contextIsPopulated = siteLanguageId;
  if (!contextIsPopulated) {
    throw new Error("useSiteLanguageContext must be used within its provider!");
  }

  const siteLanguage = useSelector((state) =>
    selectLanguageById(state, siteLanguageId)
  ) as { id: SiteLanguageId; name: SiteLanguageId };

  return siteLanguage;
};

SiteLanguage.Popover = function SiteLanguagePopover() {
  const [{ siteLanguageId }] = useSiteLanguageContext();

  return (
    <WithProximityPopover panel={<Panel />}>
      <LabelUI languageName={siteLanguageId} />
    </WithProximityPopover>
  );
};

const LabelUI = ({ languageName }: { languageName: SiteLanguageId }) => {
  return (
    <WithTooltip text="site language" placement="right">
      <button css={[tw`flex gap-xxxs items-center`]}>
        <span css={[s_button.subIcon, tw`text-sm -translate-y-1`]}>
          <TranslateIcon />
        </span>
        <span css={[tw`text-sm capitalize`]}>{languageName}</span>
      </button>
    </WithTooltip>
  );
};

const Panel = () => {
  return <PanelUI languages={<LanguagesRadio />} />;
};

const PanelUI = ({ languages }: { languages: ReactElement }) => {
  return (
    <div css={[s_popover.panelContainer]}>
      <div>
        <h4 css={[tw`font-medium text-lg`]}>Site language</h4>
        <p css={[tw`text-gray-600 mt-xs text-sm`]}>
          Determines the language the site is shown in. For translatable
          documents, e.g. articles, the site will show most relevant
          translation.
        </p>
      </div>
      <div css={[tw`flex flex-col gap-lg items-start`]}>{languages}</div>
    </div>
  );
};

const LanguagesRadio = () => {
  const [{ siteLanguageId }, { setSiteLanguageId }] = useSiteLanguageContext();

  return (
    <LanguagesRadioUI
      languages={siteLanguageIdsArr}
      setValue={setSiteLanguageId}
      value={siteLanguageIds[siteLanguageId]}
    />
  );
};

const LanguagesRadioUI = ({
  languages,
  setValue,
  value,
}: {
  languages: typeof siteLanguageIdsArr;
  value: SiteLanguageId;
  setValue: (siteLanguageId: SiteLanguageId) => void;
}) => (
  <RadioGroup
    as="div"
    css={[tw`flex items-center gap-md`]}
    value={value}
    onChange={(language) => setValue(language)}
  >
    <div css={[tw`flex items-center gap-lg`]}>
      {languages.map((language) => (
        <RadioGroup.Option value={language} key={language}>
          {({ checked }) => (
            <WithTooltip
              text={checked ? "active language" : "make active"}
              type={checked ? "info" : "action"}
            >
              <div css={[tw`flex items-center gap-xs`]}>
                {checked ? (
                  <span css={[tw`text-green-active `]}>
                    <CheckIcon />
                  </span>
                ) : null}
                <span
                  css={[
                    tw`capitalize`,
                    checked ? tw`font-medium` : tw`cursor-pointer`,
                  ]}
                >
                  {language}
                </span>
              </div>
            </WithTooltip>
          )}
        </RadioGroup.Option>
      ))}
    </div>
  </RadioGroup>
);
