import ArticleTableSectionSlice from "^context/articles/ArticleTableSectionContext";
import SectionMenu_ from "../_containers/SectionMenu_";

const Menu = ({ isShowing }: { isShowing: boolean }) => {
  const [{ id, index }] = ArticleTableSectionSlice.useContext();

  return (
    <SectionMenu_ isShowing={isShowing} sectionId={id} sectionIndex={index} />
  );
};

export default Menu;
