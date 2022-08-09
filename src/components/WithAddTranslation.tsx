import { ComponentProps, ReactElement } from "react";
import tw from "twin.macro";

import LanguagesInputWithSelect from "./languages/LanguageInputWithSelect";
import WithProximityPopover from "./WithProximityPopover";

import { s_popover } from "^styles/popover";

type LanguageInputSelectProps = ComponentProps<typeof LanguagesInputWithSelect>;

const WithAddTranslation = ({
  children,
  ...langageInputSelectProps
}: {
  children: ReactElement;
} & LanguageInputSelectProps) => {
  return (
    <WithProximityPopover
      panel={
        <Panel
          languageInputSelect={
            <LanguagesInputWithSelect {...langageInputSelectProps} />
          }
        />
      }
    >
      {children}
    </WithProximityPopover>
  );
};

export default WithAddTranslation;

const Panel = ({
  languageInputSelect,
}: {
  languageInputSelect: ReactElement;
}) => {
  return <PanelUI languageInputSelect={languageInputSelect} />;
};

const PanelUI = ({
  languageInputSelect,
}: {
  languageInputSelect: ReactElement;
}) => (
  <div css={[s_popover.panelContainer, tw`min-w-[50ch]`]}>
    <div>
      <h4 css={[s_popover.title, tw`text-base`]}>Add translation</h4>
      <p css={[s_popover.explanatoryText]}>
        Search for an existing language or create a new one.
      </p>
    </div>
    <div>{languageInputSelect}</div>
  </div>
);
