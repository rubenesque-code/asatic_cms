import BodyEmptyUI from "^components/article-like/entity-page/article/BodyEmptyUI";
import AddSectionPopover from "./AddSectionPopover";

const ArticleBodyEmpty = () => {
  return (
    <BodyEmptyUI>
      <AddSectionPopover sectionToAddIndex={0}>
        <BodyEmptyUI.AddSectionButton />
      </AddSectionPopover>
    </BodyEmptyUI>
  );
};

export default ArticleBodyEmpty;
