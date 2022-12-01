import { ReactElement } from "react";
import tw from "twin.macro";

const nameInputId = "name-input-id";

export const $FormContainer_ = ({
  children,
  icon,
}: {
  children: ReactElement | ReactElement[];
  icon: ReactElement;
}) => (
  <div>
    <h2 css={[tw`font-medium text-xl flex items-center gap-xs text-gray-800`]}>
      <span css={[tw`text-gray-600`]}>{icon}</span>
      <span>Create new</span>
    </h2>
    {children}
  </div>
);

export const $NameInput_ = ({
  setValue,
  value,
}: {
  value: string;
  setValue: (value: string) => void;
}) => {
  return (
    <div css={[tw`flex items-center gap-sm mt-xxs`]}>
      <label css={[tw`text-gray-600`]} htmlFor={nameInputId}>
        Name:
      </label>
      <input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        id={nameInputId}
        placeholder="name..."
        css={[tw`py-0.5 w-full rounded-md outline-none focus:outline-none`]}
        type="text"
      />
    </div>
  );
};
