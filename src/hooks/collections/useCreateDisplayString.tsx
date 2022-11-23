import { useSelector } from "^redux/hooks";
import { selectCollectionsByIds } from "^redux/state/collections";

const useCreateCollectionsDisplayString = ({
  activeLanguageId,
  collectionsIds: collectionsIds,
}: {
  collectionsIds: string[];
  activeLanguageId: string;
}) => {
  const collections = useSelector((state) =>
    selectCollectionsByIds(state, collectionsIds)
  );
  const collectionsStr = collections
    .map((author) => {
      if (!author) {
        return "[not found]";
      }
      const translation = author.translations.find(
        (t) => t.languageId === activeLanguageId
      );
      if (!translation || !translation.title?.length) {
        return "[translation missing]";
      }
      return translation.title;
    })
    .join(", ");

  return collectionsStr;
};

export default useCreateCollectionsDisplayString;
