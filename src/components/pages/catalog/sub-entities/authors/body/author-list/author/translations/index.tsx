import tw from "twin.macro";
import AuthorSlice from "^context/authors/AuthorContext";

import AddOne from "./AddOne";
import Translation from "./translation";

const $TranslationDivider = tw.div`w-[1px] h-[15px] bg-gray-200`;

// todo: remove author translation languages from add new translation popover
// todo: can delete translation if not in use
// todo: test delete author

const Translations = () => {
  const [{ translations }] = AuthorSlice.useContext();

  return (
    <div>
      <div css={[tw`flex items-center gap-sm`]}>
        <h4 css={[tw`text-gray-600`]}>Translations</h4>
        <div>
          <AddOne />
        </div>
      </div>
      <div css={[tw`flex items-center gap-xs mt-xs`]}>
        {translations.map((translation, i) => (
          <div css={[tw`flex gap-sm items-baseline`]} key={i}>
            {i !== 0 ? <$TranslationDivider /> : null}
            <Translation translation={translation} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Translations;
