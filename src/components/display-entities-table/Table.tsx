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
  | "Authors"
  | "Subjects"
  | "Collections"
  | "Tags"
  | "Translations";

const Table = ({
  children: tableRows,
  columns,
  isFilter,
}: {
  children: ReactElement[];
  columns: Tuple<Column, 5 | 6 | 7 | 8>;
  isFilter: boolean;
}) => {
  return (
    <$TableContainer numColumns={columns.length}>
      {columns.map((columnTitle) => (
        <$HeaderCell key={columnTitle}>{columnTitle}</$HeaderCell>
      ))}
      {tableRows.length ? (
        tableRows
      ) : (
        <$NoEntriesText numColumns={columns.length}>
          {isFilter ? "- No entries for filter -" : "- No entries yet -"}
        </$NoEntriesText>
      )}
      <$BottomSpacingForScrollbar numColumns={columns.length} />
    </$TableContainer>
  );
};

export default Table;
