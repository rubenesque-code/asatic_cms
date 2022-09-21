import HeaderGeneric from "^components/header/Header";
import SiteLanguage from "^components/SiteLanguage";

const Header = () => {
  return <HeaderGeneric leftElements={<SiteLanguage.Popover />} />;
};

export default Header;
