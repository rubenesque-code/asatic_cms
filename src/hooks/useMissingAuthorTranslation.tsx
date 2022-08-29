import { useSelector } from "^redux/hooks";
import { selectAuthorsByIds } from "^redux/state/authors";

const useMissingAuthorTranslation = ({
  languagesById,
  authorsById,
}: {
  languagesById: string[];
  authorsById: string[];
}) => {
  const authors = useSelector((state) =>
    selectAuthorsByIds(state, authorsById)
  );
  const validAuthors = authors.flatMap((c) => (c ? [c] : []));
  let isMissingTranslation = false;

  for (let i = 0; i < languagesById.length; i++) {
    const languageId = languagesById[i];

    for (let j = 0; j < validAuthors.length; j++) {
      const { translations } = validAuthors[j];
      const collectionLanguagesById = translations.map((t) => t.languageId);

      if (!collectionLanguagesById.includes(languageId)) {
        isMissingTranslation = true;
      }
    }
  }

  return isMissingTranslation;
};

export default useMissingAuthorTranslation;
