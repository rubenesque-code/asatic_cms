import tw from "twin.macro";
import TextFormInput from "./TextFormInput";

type TextFormInputProps = Parameters<typeof TextFormInput>[0];

const SimpleInputPanel = ({
  heading,
  ...textFormInputProps
}: { heading: string } & TextFormInputProps) => {
  return (
    <div css={[tw`p-sm bg-white rounded-lg border-2 border-black`]}>
      <h4 css={[tw`text-base font-medium mb-sm`]}>{heading}</h4>
      <TextFormInput {...textFormInputProps} />
    </div>
  );
};

export default SimpleInputPanel;
