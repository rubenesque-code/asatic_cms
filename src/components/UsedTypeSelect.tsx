import { createContext, ReactElement, useContext, useState } from "react";
import { RadioGroup } from "@headlessui/react";
import tw from "twin.macro";

import { checkObjectHasField } from "^helpers/general";

export type UsedTypeFilter = "used" | "unused" | "all";

const typeSelectOptionsData: { value: UsedTypeFilter }[] = [
  { value: "all" },
  { value: "used" },
  { value: "unused" },
];

export const UsedTypeSelect = () => {
  const { setValue, value } = useContext(Context);

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

type ContextValue = {
  value: UsedTypeFilter;
  setValue: (value: UsedTypeFilter) => void;
};
const Context = createContext<ContextValue>({} as ContextValue);

export function UsedTypeProvider({ children }: { children: ReactElement }) {
  const [value, setValue] = useState<UsedTypeFilter>("all");

  return (
    <Context.Provider value={{ value, setValue }}>{children}</Context.Provider>
  );
}

export function useUsedTypeContext() {
  const context = useContext(Context);
  const contextIsEmpty = !checkObjectHasField(context);
  if (contextIsEmpty) {
    throw new Error("useUsedTypeContext must be used within its provider!");
  }
  const { value } = context;

  return { value };
}
