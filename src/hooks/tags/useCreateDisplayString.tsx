import { useSelector } from "^redux/hooks";
import { selectTagsByIds } from "^redux/state/tags";

const useCreateTagsDisplayString = ({
  tagsIds: tagsIds,
}: {
  tagsIds: string[];
}) => {
  const tags = useSelector((state) => selectTagsByIds(state, tagsIds));
  const collectionsStr = tags
    .map((tag) => {
      if (!tag) {
        return "[not found]";
      }

      return tag.text;
    })
    .join(", ");

  return collectionsStr;
};

export default useCreateTagsDisplayString;
