import { $DocumentBodyEmpty_ } from "^components/pages/curated/document/_presentation/article-like";
import AddSectionPopover from "./AddSectionPopover";

const Empty = () => {
  return (
    <$DocumentBodyEmpty_
      addSectionPopover={(button) => (
        <AddSectionPopover sectionToAddIndex={0}>{button}</AddSectionPopover>
      )}
      entityType="article"
    />
  );
};

export default Empty;
