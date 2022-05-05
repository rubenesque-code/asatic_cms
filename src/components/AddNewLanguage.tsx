import tw from "twin.macro";
import { useDispatch, useSelector } from "^redux/hooks";

import { selectAll, addOne as addLanguage } from "^redux/state/languages";
import TextFormInput from "./TextFormInput";

const AddNewLanguage = ({
  onAddNewLanguage,
}: {
  onAddNewLanguage: (languageId: string) => void;
}) => {
  // todo: error handling if lang already exists
  const dispatch = useDispatch();

  const languages = useSelector(selectAll);
  const existingLanguageNames = languages.map((language) => language.name);

  const handleNewLanguageSubmit = (languageName: string) => {
    const languageInUse = existingLanguageNames.includes(languageName);
    if (languageInUse) {
      return;
    }

    dispatch(addLanguage({ id: languageName, name: languageName }));
    onAddNewLanguage(languageName);
  };

  return (
    <div>
      <h4 css={[tw`font-medium mb-sm`]}>Add new language</h4>
      <TextFormInput
        onSubmit={handleNewLanguageSubmit}
        placeholder="Enter language name"
      />
    </div>
  );
};

export default AddNewLanguage;
