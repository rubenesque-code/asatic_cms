import { $DocumentBodyEmpty_ } from "^document-pages/_presentation/article-like";
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
