import { useSelector } from "^redux/hooks";
import { selectLanguagesByIds } from "^redux/state/languages";

function useCreateLanguagesDisplayString({
  languagesIds: languagesIds,
}: {
  languagesIds: string[];
}) {
  const languages = useSelector((state) =>
    selectLanguagesByIds(state, languagesIds)
  );
  const languagesStr = languages
    .map((language) => {
      if (!language) {
        return "[not found]";
      }

      return language.name;
    })
    .join(", ");

  return languagesStr;
}

export default useCreateLanguagesDisplayString;
