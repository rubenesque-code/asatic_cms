import { RadioGroup } from "@headlessui/react";
import { Check as CheckIcon, Translate as TranslateIcon } from "phosphor-react";
import { createContext, ReactElement, useContext } from "react";
import tw from "twin.macro";
import WithProximityPopover from "^components/WithProximityPopover";
import WithTooltip from "^components/WithTooltip";
import { siteLanguageIDsArr } from "^constants/data";
import { checkObjectHasField } from "^helpers/general";
import { useSelector } from "^redux/hooks";
import { selectById, selectEntitiesByIds } from "^redux/state/languages";
import s_button from "^styles/button";
import { s_popover } from "^styles/popover";
import { Language } from "^types/language";

type ContextValue = [
  language: Language,
  actions: { onUpdateLanguage: TopProps["onUpdateLanguage"] }
];

const Context = createContext<ContextValue>([{}, {}] as ContextValue);

const Provider = ({
  children,
  languageId,
  onUpdateLanguage,
}: {
  children: ReactElement;
} & TopProps) => {
  const language = useSelector((state) => selectById(state, languageId))!;

  const value = [language, { onUpdateLanguage }] as ContextValue;

  return <Context.Provider value={value}>{children}</Context.Provider>;
};

const useLanguageContext = () => {
  const context = useContext(Context);
  const contextIsPopulated = checkObjectHasField(context[0]);
  if (!contextIsPopulated) {
    throw new Error("useLanguageContext must be used within its provider!");
  }
  return context;
};

type TopProps = {
  languageId: string;
  onUpdateLanguage: (languageId: string) => void;
};

const SiteLanguagePopover = (props: TopProps) => {
  return (
    <Provider {...props}>
      <WithProximityPopover panel={<Panel />}>
        <Label />
      </WithProximityPopover>
    </Provider>
  );
};

export default SiteLanguagePopover;

const Label = () => {
  const [{ name }] = useLanguageContext();

  return <LabelUI languageName={name} />;
};

const LabelUI = ({ languageName }: { languageName: string }) => {
  return (
    <WithTooltip text="site language" placement="right">
      <button css={[tw`flex gap-xxxs items-center`]}>
        <span css={[s_button.subIcon, tw`text-sm -translate-y-1`]}>
          <TranslateIcon />
        </span>
        <span css={[tw`text-sm`]}>{languageName}</span>
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
          documents, e.g. articles, the site will show the relevant translation
          if it exists.
        </p>
      </div>
      <div css={[tw`flex flex-col gap-lg items-start`]}>{languages}</div>
    </div>
  );
};

const LanguagesRadio = () => {
  const [language, { onUpdateLanguage }] = useLanguageContext();
  // todo: don't assert
  const siteLanguages = useSelector((state) =>
    selectEntitiesByIds(state, siteLanguageIDsArr)
  ) as Language[];

  return (
    <LanguagesRadioUI
      languages={siteLanguages}
      setValue={onUpdateLanguage}
      value={language}
    />
  );
};

const LanguagesRadioUI = ({
  languages,
  setValue,
  value,
}: {
  languages: Language[];
  value: Language;
  setValue: (languageId: string) => void;
}) => (
  <RadioGroup
    as="div"
    css={[tw`flex items-center gap-md`]}
    value={value}
    onChange={(language) => setValue(language.id)}
  >
    <div css={[tw`flex items-center gap-lg`]}>
      {languages.map((language) => (
        <RadioGroup.Option value={language} key={language.id}>
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
                <span css={[checked ? tw`font-medium` : tw`cursor-pointer`]}>
                  {language.name}
                </span>
              </div>
            </WithTooltip>
          )}
        </RadioGroup.Option>
      ))}
    </div>
  </RadioGroup>
);
