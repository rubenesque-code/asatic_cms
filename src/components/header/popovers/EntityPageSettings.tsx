import { MyOmit } from "^types/utilities";

import { SettingsIcon } from "^components/Icons";
import {
  EntityPageSettingsPopover_,
  EntityPageSettingsPopover_Props,
} from "^components/rich-popover/entity-page-settings";
import $IconButton_ from "../_presentation/$IconButton_";

export const HeaderEntityPageSettingsPopover_ = (
  props: MyOmit<EntityPageSettingsPopover_Props, "children">
) => {
  return (
    <EntityPageSettingsPopover_ {...props}>
      <Button />
    </EntityPageSettingsPopover_>
  );
};

const Button = () => {
  return (
    <$IconButton_ tooltip="settings">
      <SettingsIcon />
    </$IconButton_>
  );
};
