import BodyEmptyUI from "^components/article-like/entity-page/article/BodyEmpty";
import AddSectionPopover from "./AddSectionPopover";

const BodyEmpty = () => {
  return (
    <BodyEmptyUI
      addSectionPopover={<AddSectionPopover sectionToAddIndex={0} />}
    />
  );
};

export default BodyEmpty;
