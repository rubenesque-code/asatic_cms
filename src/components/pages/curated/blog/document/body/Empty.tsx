import { $DocumentBodyEmpty_ } from "../../../_presentation/article-like";
import AddSectionPopover from "./AddSectionPopover";

const Empty = () => {
  return (
    <$DocumentBodyEmpty_
      addSectionPopover={(button) => (
        <AddSectionPopover sectionToAddIndex={0}>{button}</AddSectionPopover>
      )}
      entityType="blog"
    />
  );
};

export default Empty;
