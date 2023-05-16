import ArticleTableSectionSlice from "^context/articles/ArticleTableSectionContext";

import TableSection_ from "^document-pages/_containers/article-like/TableSection_";
import Menu from "./Menu";

export default function TableSection() {
  const tableSlice = ArticleTableSectionSlice.useContext();

  return (
    <TableSection_
      tableSlice={tableSlice}
      menu={(containerIsHovered) => <Menu isShowing={containerIsHovered} />}
    />
  );
}
