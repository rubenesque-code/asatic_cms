import { RadioGroup } from "@headlessui/react";
import tw from "twin.macro";

export type UsedTypeFilter = "used" | "unused" | "all";

const typeSelectOptionsData: { value: UsedTypeFilter }[] = [
  { value: "all" },
  { value: "used" },
  { value: "unused" },
];

const UsedTypeRadioUI = ({
  setValue,
  value,
}: {
  value: UsedTypeFilter;
  setValue: (type: UsedTypeFilter) => void;
}) => {
  return (
    <RadioGroup
      as="div"
      css={[tw`flex items-center gap-md`]}
      value={value}
      onChange={setValue}
    >
      <RadioGroup.Label>Type:</RadioGroup.Label>
      <div css={[tw`flex items-center gap-sm`]}>
        {typeSelectOptionsData.map((option) => (
          <RadioGroup.Option value={option.value} key={option.value}>
            {({ checked }) => (
              <span
                css={[
                  checked
                    ? tw`underline text-green-active`
                    : tw`cursor-pointer`,
                ]}
              >
                {option.value}
              </span>
            )}
          </RadioGroup.Option>
        ))}
      </div>
    </RadioGroup>
  );
};

export default UsedTypeRadioUI;
