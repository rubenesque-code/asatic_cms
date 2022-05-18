import tw from "twin.macro";

import DeployPopover from "./DeployPopover";
import DocControls from "./DocControls";
import NavMenu from "./NavMenu";

// todo: inter font
// todo: toasts for save (was using chakra toasts for birch)

const Header = () => {
  return (
    <header css={[s.header]}>
      <NavMenu />
      <DeployPopover />
      <DocControls />
    </header>
  );
};

export default Header;

// drodown nav: page links + logout
// deploy panel: button
// undo + save
const s = {
  header: tw`flex items-center justify-between px-xs py-xxs`,
};
