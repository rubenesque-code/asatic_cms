import { DeployIcon } from "^components/Icons";
import $IconButton_ from "../_presentation/$IconButton_";
import { DeployPopover } from "^components/rich-popover/deploy";

export const HeaderDeployPopover = () => {
  return (
    <DeployPopover>
      <Button />
    </DeployPopover>
  );
};

const Button = () => {
  return (
    <$IconButton_ tooltip="deploy">
      <DeployIcon />
    </$IconButton_>
  );
};
