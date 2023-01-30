import tw from "twin.macro";
import { useTable } from "react-table";

import TextArea from "^components/editors/TextArea";
import ArticleTableSectionSlice from "^context/articles/ArticleTableSectionContext";

import WithTooltip from "^components/WithTooltip";
import { PlusCircle, TextAa, Trash } from "phosphor-react";

export default function TableSection() {
  const [
    { columns, notes, rows: data, title, col1IsTitular },
    {
      addTableColumn,
      addTableRow,
      deleteTableColumn,
      deleteTableRow,
      updateTableCellText,
      updateTableHeaderText,
      updateTableNotes,
      updateTableTitle,
      toggleTableCol1IsTitular,
    },
  ] = ArticleTableSectionSlice.useContext();

  const tableInstance = useTable({ columns, data });

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    tableInstance;

  return (
    <div css={[tw`inline-block max-w-[800px] overflow-x-auto pb-md`]}>
      <div>
        <TextArea
          injectedValue={title}
          onBlur={(title) => updateTableTitle({ title })}
          placeholder="Optional title..."
        />
      </div>
      <table {...getTableProps()} css={[tw`relative pt-xl ml-md mt-lg`]}>
        <thead>
          {headerGroups.map((headerGroup, i) => (
            <tr {...headerGroup.getHeaderGroupProps()} key={i}>
              {headerGroup.headers.map((column, colIndex) => {
                const textLength = column.render("Header")?.toString().length;

                return (
                  <th
                    {...column.getHeaderProps()}
                    css={[
                      tw`relative border py-xs px-sm`,
                      !textLength ? tw`text-gray-placeholder` : tw``,
                    ]}
                    key={colIndex}
                  >
                    <input
                      type="text"
                      placeholder={`Header ${colIndex + 1}...`}
                      value={column.render("Header")?.toString()}
                      onChange={(e) =>
                        updateTableHeaderText({
                          colIndex: colIndex,
                          text: e.target.value,
                        })
                      }
                      css={[
                        col1IsTitular && colIndex === 0
                          ? tw`text-left`
                          : tw`text-center`,
                      ]}
                    />
                    {/*                     {textLength
                      ? column.render("Header")
                      : `Header ${columnIndex + 1}...`} */}
                    {columns.length > 1 ? (
                      <WithTooltip text="delete column" type="action">
                        <button
                          onClick={() => deleteTableColumn({ colIndex })}
                          css={[
                            tw`absolute left-1/2 -translate-x-1/2 -top-xs -translate-y-full text-black`,
                          ]}
                          type="button"
                        >
                          <Trash />
                        </button>
                      </WithTooltip>
                    ) : null}
                    {colIndex === 0 ? (
                      <div
                        onClick={() => toggleTableCol1IsTitular}
                        css={[tw`absolute right-0 top-0`]}
                      >
                        <TextAa />
                      </div>
                    ) : null}
                  </th>
                );
              })}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {rows.map((row, rowIndex) => {
            prepareRow(row);
            return (
              <tr {...row.getRowProps()} key={rowIndex}>
                {row.cells.map((cell, rowCellIndex) => {
                  const textLength = cell.value.length;

                  return (
                    <td
                      {...cell.getCellProps()}
                      css={[
                        tw`relative border py-xs px-sm`,
                        !textLength ? tw`text-gray-placeholder` : tw``,
                        cell.column.id === "col1" && col1IsTitular
                          ? tw`text-left font-semibold`
                          : tw`text-center`,
                      ]}
                      key={rowCellIndex}
                    >
                      <input
                        type="text"
                        placeholder="..."
                        value={cell.value}
                        onChange={(e) =>
                          updateTableCellText({
                            rowIndex,
                            text: e.target.value,
                            colAccessor: cell.column.id,
                          })
                        }
                        css={[
                          col1IsTitular && cell.column.id === "col1"
                            ? tw`text-left`
                            : tw`text-center`,
                        ]}
                      />
                      {cell.column.id === "col1" ? (
                        <WithTooltip text="delete row" type="action">
                          <button
                            onClick={() => deleteTableRow({ rowIndex })}
                            css={[
                              tw`absolute -left-xs -translate-x-full top-1/2 -translate-y-1/2 text-black`,
                            ]}
                            type="button"
                          >
                            <Trash />
                          </button>
                        </WithTooltip>
                      ) : null}
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
        <WithTooltip text="add column" type="action">
          <button
            onClick={() => addTableColumn({ colNum: columns.length + 1 })}
            css={[
              tw`absolute -right-xs translate-x-full top-1/2 -translate-y-1/2`,
            ]}
            type="button"
          >
            <PlusCircle />
          </button>
        </WithTooltip>
        <WithTooltip text="add row" type="action">
          <button
            onClick={() => addTableRow()}
            css={[
              tw`absolute left-1/2 -translate-x-1/2 -bottom-xs translate-y-full`,
            ]}
            type="button"
          >
            <PlusCircle />
          </button>
        </WithTooltip>
      </table>
      <div css={[tw`mt-lg p-sm border`]}>
        <TextArea
          injectedValue={notes}
          onBlur={(notes) => updateTableNotes({ notes })}
          placeholder="table notes"
        />
      </div>
    </div>
  );
}
