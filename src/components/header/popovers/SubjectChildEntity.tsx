import { Plus } from "phosphor-react";

import { MyOmit } from "^types/utilities";

import $IconButton_ from "../_presentation/$IconButton_";
import {
  SubjectChildEntityPopover_,
  DisplayEntityPopover_Props,
} from "^components/rich-popover/subject-child-entity";

export const HeaderSubjectChildEntityPopover_ = (
  props: MyOmit<DisplayEntityPopover_Props, "children">
) => {
  return (
    <SubjectChildEntityPopover_ {...props}>
      <Button />
    </SubjectChildEntityPopover_>
  );
};

const Button = () => {
  return (
    <$IconButton_ tooltip="add content">
      <Plus />
    </$IconButton_>
  );
};
