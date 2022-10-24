import { Plus } from "phosphor-react";

import { MyOmit } from "^types/utilities";

import $IconButton_ from "../_presentation/$IconButton_";
import {
  PrimaryEntityPopover_,
  PrimaryEntityPopover_Props,
} from "^components/rich-popover/primary-entity";

export const HeaderPrimaryEntityPopover_ = (
  props: MyOmit<PrimaryEntityPopover_Props, "children">
) => {
  return (
    <PrimaryEntityPopover_ {...props}>
      <Button />
    </PrimaryEntityPopover_>
  );
};

const Button = () => {
  return (
    <$IconButton_ tooltip="add content">
      <Plus />
    </$IconButton_>
  );
};
