import { useSelector } from "^redux/hooks";
import { selectAuthorsByIds } from "^redux/state/authors";

const useCreateAuthorsDisplayString = ({
  activeLanguageId,
  authorsIds,
}: {
  authorsIds: string[];
  activeLanguageId: string;
}) => {
  const authors = useSelector((state) => selectAuthorsByIds(state, authorsIds));
  const authorsStr = authors
    .map((author) => {
      if (!author) {
        return "[not found]";
      }
      const translation = author.translations.find(
        (t) => t.languageId === activeLanguageId
      );
      if (!translation || !translation.name.length) {
        return "[translation missing]";
      }
      return translation.name;
    })
    .join(", ");

  return authorsStr;
};

export default useCreateAuthorsDisplayString;
