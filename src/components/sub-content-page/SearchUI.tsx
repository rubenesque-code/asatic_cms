import tw from "twin.macro";

const filterInputId = "filter-input-id";

const SearchUI = ({
  labelText,
  onQueryChange,
  placeholder,
  query,
}: {
  labelText: string;
  onQueryChange: (value: string) => void;
  placeholder: string;
  query: string;
}) => (
  <div css={[tw`relative flex items-center gap-xs`]}>
    <label htmlFor={filterInputId}>{labelText}</label>
    <input
      css={[
        tw`text-gray-600 focus:text-gray-800 px-xs py-1 outline-none border-2 border-transparent focus:border-gray-200 rounded-sm`,
      ]}
      id={filterInputId}
      value={query}
      onChange={(e) => {
        const value = e.target.value;
        onQueryChange(value);
      }}
      placeholder={placeholder}
      type="text"
      autoComplete="off"
    />
  </div>
);

export default SearchUI;
