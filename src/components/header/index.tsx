import tw from "twin.macro";
import DeployPopover from "./DeployPopover";
import DocControls from "./DocControls";
import NavMenu from "./NavMenu";

// todo: inter font
// todo: create tailwind tokens for repeated classes e.g. popover panel shadow and roundness, button padding, caret-down color, icon size
// todo: toasts for save (was using chakra toasts for birch)
// todo: tooltip and warning for `DocControls`

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
