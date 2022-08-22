import { CloudArrowUp } from "phosphor-react";

import Header from "./Header";

const DeployPopover = () => {
  return (
    <Header.IconButton tooltip="deploy">
      <CloudArrowUp />
    </Header.IconButton>
  );
};

export default DeployPopover;
