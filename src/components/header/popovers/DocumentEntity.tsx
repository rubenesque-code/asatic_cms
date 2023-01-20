import { Plus } from "phosphor-react";

import { MyOmit } from "^types/utilities";

import $IconButton_ from "../_presentation/$IconButton_";
import {
  DocumentEntityPopover_,
  DocumentEntityPopover_Props,
} from "^components/rich-popover/document-entity";

export const HeaderDocumentEntityPopover_ = (
  props: MyOmit<DocumentEntityPopover_Props, "children">
) => {
  return (
    <DocumentEntityPopover_ {...props}>
      <Button />
    </DocumentEntityPopover_>
  );
};

const Button = () => {
  return (
    <$IconButton_ tooltip="add content">
      <Plus />
    </$IconButton_>
  );
};
