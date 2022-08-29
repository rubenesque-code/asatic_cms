import { createContext, ReactElement, useContext, useState } from "react";
import tw from "twin.macro";

// eslint-disable-next-line @typescript-eslint/no-empty-function
export default function DocsQuery() {}

type Value = {
  query: string;
  setQuery: (query: string) => void;
};
const Context = createContext<Value>({} as Value);

DocsQuery.Provider = function QueryProvider({
  children,
}: {
  children: ReactElement;
}) {
  const [query, setQuery] = useState("");
  return (
    <Context.Provider value={{ query, setQuery }}>{children}</Context.Provider>
  );
};

DocsQuery.useContext = function useQueryContext() {
  const { query } = useContext(Context);
  const contextIsPopulated = query;
  if (!contextIsPopulated) {
    throw new Error("useQueryContext must be used within its provider!");
  }

  return query;
};

function useQueryContext() {
  const context = useContext(Context);
  if (context === undefined) {
    throw new Error("useQueryContext must be used within its provider!");
  }
  return context;
}

const filterInputId = "filter-input-id";

DocsQuery.InputCard = function InputCard({
  placeholder = "search by title, subject, etc.",
}: {
  placeholder?: string;
}) {
  const { query, setQuery } = useQueryContext();

  return (
    <div css={[tw`relative flex items-center gap-xs`]}>
      <label htmlFor={filterInputId}>Search:</label>
      <input
        css={[
          tw`text-gray-600 focus:text-gray-800 px-xs py-1 outline-none border-2 border-transparent focus:border-gray-200 rounded-sm`,
        ]}
        id={filterInputId}
        value={query}
        onChange={(e) => {
          const value = e.target.value;
          setQuery(value);
        }}
        placeholder={placeholder}
        type="text"
        autoComplete="off"
      />
    </div>
  );
};
