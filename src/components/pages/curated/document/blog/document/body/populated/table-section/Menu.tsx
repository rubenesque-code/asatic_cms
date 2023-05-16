import BlogTableSectionSlice from "^context/blogs/BlogTableSectionContext";
import SectionMenu_ from "../_containers/SectionMenu_";

const Menu = ({ isShowing }: { isShowing: boolean }) => {
  const [{ id, index }] = BlogTableSectionSlice.useContext();

  return (
    <SectionMenu_ isShowing={isShowing} sectionId={id} sectionIndex={index} />
  );
};

export default Menu;
