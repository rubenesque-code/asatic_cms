import { SubjectIcon } from "^components/Icons";
import { SubjectsPopoverButton_ } from "^components/rich-popover/subjects";
import $RelatedEntityButton_ from "../_presentation/$RelatedEntityButton_";

const SubjectsHeaderButton = () => {
  return (
    <SubjectsPopoverButton_>
      {({ subjectStatus }) => (
        <$RelatedEntityButton_
          errors={typeof subjectStatus === "object" ? subjectStatus : null}
          tooltip="subjects"
        >
          <SubjectIcon />
        </$RelatedEntityButton_>
      )}
    </SubjectsPopoverButton_>
  );
};

export default SubjectsHeaderButton;
