import { Plus, Translate } from "phosphor-react";
import { ReactElement } from "react";
import tw from "twin.macro";
import s_transition from "^styles/transition";

export default function InputSelectComboUI() {
  return <div css={[tw`relative w-full`]}></div>;
}

const inputId = "subject-input";

InputSelectComboUI.Input = function Input({
  focusHandlers,
  setValue,
  value,
  onSubmit,
}: {
  focusHandlers: {
    onFocus: () => void;
    onBlur: () => void;
  };
  setValue: (text: string) => void;
  value: string;
  onSubmit: () => void;
}) {
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit();
      }}
    >
      <div css={[tw`relative`]}>
        <input
          css={[
            tw`px-lg py-1 text-sm outline-none border-2 border-transparent focus:border-gray-200 rounded-sm`,
          ]}
          id={inputId}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Add a new subject..."
          type="text"
          autoComplete="off"
          {...focusHandlers}
        />
        <label
          css={[tw`absolute left-2 top-1/2 -translate-y-1/2 text-gray-500`]}
          htmlFor={inputId}
        >
          <Plus />
        </label>
        <Language languageText={} show={} />
      </div>
    </form>
  );
};

function Language({
  languageText,
  show,
}: {
  languageText: ReactElement | string;
  show: boolean;
}) {
  return (
    <div
      css={[
        tw`absolute top-2 right-0 -translate-y-full flex items-center gap-xxs bg-white`,
        s_transition.toggleVisiblity(show),
        tw`transition-opacity duration-75 ease-in-out`,
      ]}
    >
      <span css={[tw`text-sm -translate-y-1 text-gray-400`]}>
        <Translate weight="light" />
      </span>
      <span css={[tw`capitalize text-gray-400 text-sm`]}>{languageText}</span>
    </div>
  );
}
