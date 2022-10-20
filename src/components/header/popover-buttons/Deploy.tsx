import { DeployIcon } from "^components/Icons";
import $IconButton_ from "../_presentation/$IconButton_";

export const HeaderDeployButton = () => {
  return (
    <$IconButton_ tooltip="deploy">
      <DeployIcon />
    </$IconButton_>
  );
};
