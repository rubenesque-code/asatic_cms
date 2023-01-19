import { ReactElement } from "react";

import { Tuple } from "^types/utilities";

import {
  $TableContainer,
  $BottomSpacingForScrollbar,
  $HeaderCell,
  $NoEntriesText,
} from "./styles";

type Column =
  | "Title"
  | "Actions"
  | "Type"
  | "Status"
  | "Authors"
  | "Subjects"
  | "Collections"
  | "Tags"
  | "Translations"
  | "Type";

const Table = ({
  children: tableRows,
  columns,
  isContent,
  isFilter,
}: {
  children: ReactElement[] | ReactElement;
  columns: Tuple<Column, 5 | 6 | 7 | 8 | 9>;
  isContent: boolean;
  isFilter: boolean;
}) => {
  return (
    <$TableContainer numColumns={columns.length}>
      {columns.map((columnTitle) => (
        <$HeaderCell key={columnTitle}>{columnTitle}</$HeaderCell>
      ))}
      {isContent ? (
        tableRows
      ) : (
        <$NoEntriesText numColumns={columns.length}>
          {isFilter ? "- No documents available -" : "-"}
        </$NoEntriesText>
      )}
      <$BottomSpacingForScrollbar numColumns={columns.length} />
    </$TableContainer>
  );
};

export default Table;
