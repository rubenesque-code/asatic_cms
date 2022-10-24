import { MyOmit } from "^types/utilities";

import { SubjectIcon } from "^components/Icons";
import {
  SubjectsPopoverButton_,
  SubjectsPopover_,
  SubjectsPopover_Props,
} from "^components/rich-popover/subjects";
import $RelatedEntityButton_ from "../_presentation/$RelatedEntityButton_";

export const HeaderSubectsPopover_ = (
  props: MyOmit<SubjectsPopover_Props, "children">
) => {
  return (
    <SubjectsPopover_ {...props}>
      <Button />
    </SubjectsPopover_>
  );
};

const Button = () => {
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
