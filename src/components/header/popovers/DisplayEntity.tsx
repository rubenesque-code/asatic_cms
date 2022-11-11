import { Plus } from "phosphor-react";

import { MyOmit } from "^types/utilities";

import $IconButton_ from "../_presentation/$IconButton_";
import {
  DisplayEntityPopover_,
  DisplayEntityPopover_Props,
} from "^components/rich-popover/display-entity";

export const HeaderDisplayEntityPopover_ = (
  props: MyOmit<DisplayEntityPopover_Props, "children">
) => {
  return (
    <DisplayEntityPopover_ {...props}>
      <Button />
    </DisplayEntityPopover_>
  );
};

const Button = () => {
  return (
    <$IconButton_ tooltip="add content">
      <Plus />
    </$IconButton_>
  );
};
