import BlogTableSectionSlice from "^context/blogs/BlogTableSectionContext";

import TableSection_ from "^document-pages/_containers/article-like/TableSection_";
import Menu from "./Menu";

export default function TableSection() {
  const tableSlice = BlogTableSectionSlice.useContext();

  return (
    <TableSection_
      tableSlice={tableSlice}
      menu={(containerIsHovered) => <Menu isShowing={containerIsHovered} />}
    />
  );
}
