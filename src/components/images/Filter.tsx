import { RadioGroup } from "@headlessui/react";
import { Funnel } from "phosphor-react";
import { Dispatch, SetStateAction } from "react";
import tw from "twin.macro";

export type UsedTypeFilter = "used" | "unused" | "all";

const Filter = ({
  keywordInputValue,
  setKeywordInputValue,
  setUsedType,
  usedType,
}: {
  keywordInputValue: string;
  setKeywordInputValue: Dispatch<SetStateAction<string>>;
  setUsedType: Dispatch<SetStateAction<UsedTypeFilter>>;
  usedType: UsedTypeFilter;
}) => {
  return (
    <div css={[tw`flex flex-col gap-sm`]}>
      <h3 css={[tw`font-medium text-xl flex items-center gap-xs`]}>
        <span>
          <Funnel />
        </span>
        <span>Filters</span>
      </h3>
      <div css={[tw`flex flex-col gap-xs`]}>
        <KeywordSearch
          setValue={setKeywordInputValue}
          value={keywordInputValue}
        />
        <div>
          <UsedTypeSelect value={usedType} setValue={setUsedType} />
        </div>
      </div>
    </div>
  );
};

export default Filter;

const keywordFilterInputId = "images-keyword-filter-input-id";

const KeywordSearch = ({
  setValue,
  value,
}: {
  setValue: Dispatch<SetStateAction<string>>;
  value: string;
}) => {
  return (
    <div css={[tw`relative flex items-center gap-xs`]}>
      <label htmlFor={keywordFilterInputId}>Keyword:</label>
      <input
        css={[
          tw`text-gray-600 focus:text-gray-800 px-xs py-1 outline-none border-2 border-transparent focus:border-gray-200 rounded-sm`,
        ]}
        id={keywordFilterInputId}
        value={value}
        onChange={(e) => {
          const value = e.target.value;
          setValue(value);
        }}
        placeholder="keyword..."
        type="text"
        autoComplete="off"
      />
    </div>
  );
};

const typeSelectOptionsData: { value: UsedTypeFilter }[] = [
  { value: "all" },
  { value: "used" },
  { value: "unused" },
];

const UsedTypeSelect = ({
  setValue,
  value,
}: {
  setValue: Dispatch<SetStateAction<UsedTypeFilter>>;
  value: UsedTypeFilter;
}) => {
  return (
    <RadioGroup
      as="div"
      css={[tw`flex items-center gap-md`]}
      value={value}
      onChange={setValue}
    >
      <RadioGroup.Label css={[tw``]}>Type:</RadioGroup.Label>
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
