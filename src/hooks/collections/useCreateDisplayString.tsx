import { useSelector } from "^redux/hooks";
import { selectCollectionsByIds } from "^redux/state/collections";

const useCreateCollectionsDisplayString = ({
  collectionsIds: collectionsIds,
}: {
  collectionsIds: string[];
}) => {
  const collections = useSelector((state) =>
    selectCollectionsByIds(state, collectionsIds)
  );
  const collectionsStr = collections
    .map((author) => {
      if (!author) {
        return "[not found]";
      }
      return author.title;
    })
    .join(", ");

  return collectionsStr;
};

export default useCreateCollectionsDisplayString;
