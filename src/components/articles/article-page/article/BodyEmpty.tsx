import BodyEmptyUI, {
  AddSectionButton,
} from "^components/article-like/entity-page/article/BodyEmpty";
import AddSectionPopover from "./AddSectionPopover";

const BodyEmpty = () => {
  return (
    <BodyEmptyUI
      addSectionPopover={
        <AddSectionPopover sectionToAddIndex={0}>
          <AddSectionButton />
        </AddSectionPopover>
      }
    />
  );
};

export default BodyEmpty;
