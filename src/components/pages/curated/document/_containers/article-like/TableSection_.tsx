import tw from "twin.macro";
import { useTable } from "react-table";

import TextArea from "^components/editors/TextArea";
import { ContextValue } from "^context/articles/ArticleTableSectionContext";

import { PlusCircle, TextAa } from "phosphor-react";
import ContainerUtility from "^components/ContainerUtilities";
import ContentMenu from "^components/menus/Content";
import { RemoveRelatedEntityIcon } from "^components/Icons";
import { ReactElement } from "react";
import InlineTextEditor from "^components/editors/Inline";

export default function TableSection({
  tableSlice: [
    {
      columns,

      notes,
      rows: data,
      title,
      col1IsTitular,
    },
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
  ],
  menu,
}: {
  tableSlice: ContextValue;
  menu: (containerIsHovered: boolean) => ReactElement;
}) {
  const tableInstance = useTable({ columns, data });

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    tableInstance;

  return (
    <ContainerUtility.isHovered
      styles={tw`relative inline-block max-w-full overflow-x-auto pb-md my-md`}
    >
      {(containerIsHovered) => (
        <>
          {menu(containerIsHovered)}
          <div>
            <TextArea
              injectedValue={title}
              onBlur={(title) => updateTableTitle({ title })}
              placeholder="Optional table title..."
              styles={tw`font-serif-eng`}
            />
          </div>
          <table {...getTableProps()} css={[tw`relative pt-xl ml-md mt-xl`]}>
            <thead>
              {headerGroups.map((headerGroup, i) => (
                <tr {...headerGroup.getHeaderGroupProps()} key={i}>
                  {headerGroup.headers.map((column, colIndex) => {
                    const textLength = column
                      .render("Header")
                      ?.toString().length;

                    return (
                      <th
                        {...column.getHeaderProps()}
                        css={[
                          tw`relative border border-gray-800 py-xs pl-sm pr-lg`,
                          !textLength ? tw`text-gray-placeholder` : tw``,
                        ]}
                        key={colIndex}
                      >
                        <InlineTextEditor
                          placeholder={`Header ${colIndex + 1}...`}
                          injectedValue={column.render("Header")?.toString()}
                          onUpdate={(text) =>
                            updateTableHeaderText({
                              colIndex: colIndex,
                              text,
                            })
                          }
                          inputStyles={
                            col1IsTitular && colIndex === 0
                              ? tw`text-left`
                              : tw`text-center`
                          }
                          centerInput={
                            col1IsTitular && colIndex === 0 ? false : true
                          }
                        />
                        {columns.length > 1 ? (
                          <ContentMenu.ButtonWithWarning
                            tooltipProps={{ text: "delete column" }}
                            warningProps={{
                              callbackToConfirm: () =>
                                deleteTableColumn({ colIndex }),
                              warningText: { heading: "Delete column?" },
                              type: "moderate",
                            }}
                            styles={tw`absolute left-1/2 -translate-x-1/2 -top-xs -translate-y-full text-black opacity-30 hover:opacity-100 transition-colors ease-in-out`}
                          >
                            <RemoveRelatedEntityIcon />
                          </ContentMenu.ButtonWithWarning>
                        ) : null}
                        {colIndex === 0 ? (
                          <ContentMenu.Button
                            onClick={toggleTableCol1IsTitular}
                            tooltipProps={{
                              text: col1IsTitular
                                ? "make column untitular"
                                : "make column titular",
                            }}
                            styles={tw`absolute right-xxxs top-xxxs opacity-50 hover:opacity-100 transition-colors ease-in-out`}
                          >
                            <TextAa />
                          </ContentMenu.Button>
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
                            tw`relative border border-gray-400 py-xs px-sm`,
                            !textLength ? tw`text-gray-placeholder` : tw``,
                            cell.column.id === "col1" && col1IsTitular
                              ? tw`text-left font-semibold`
                              : tw`text-center`,
                          ]}
                          key={rowCellIndex}
                        >
                          <InlineTextEditor
                            placeholder="..."
                            injectedValue={cell.value}
                            onUpdate={(text) =>
                              updateTableCellText({
                                rowIndex,
                                text,
                                colAccessor: cell.column.id,
                              })
                            }
                            inputStyles={
                              col1IsTitular && cell.column.id === "col1"
                                ? tw`text-left`
                                : tw`text-center`
                            }
                            centerInput={
                              col1IsTitular && cell.column.id === "col1"
                                ? false
                                : true
                            }
                          />
                          {cell.column.id === "col1" ? (
                            <ContentMenu.ButtonWithWarning
                              tooltipProps={{ text: "delete row" }}
                              warningProps={{
                                callbackToConfirm: () =>
                                  deleteTableRow({ rowIndex }),
                                warningText: { heading: "Delete Row?" },
                                type: "moderate",
                              }}
                              styles={tw`absolute -left-xs -translate-x-full top-1/2 -translate-y-1/2 text-black opacity-30 hover:opacity-100 transition-colors ease-in-out`}
                            >
                              <RemoveRelatedEntityIcon />
                            </ContentMenu.ButtonWithWarning>
                          ) : null}
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
            <ContentMenu.Button
              onClick={() => addTableColumn({ colNum: columns.length + 1 })}
              tooltipProps={{ text: "add column" }}
              styles={tw`absolute -right-xs translate-x-full top-1/2 -translate-y-1/2 opacity-30 hover:opacity-100 transition-colors ease-in-out`}
            >
              <PlusCircle />
            </ContentMenu.Button>
            <ContentMenu.Button
              onClick={addTableRow}
              tooltipProps={{ text: "add row" }}
              styles={tw`absolute left-1/2 -translate-x-1/2 -bottom-xs translate-y-full opacity-30 hover:opacity-100 transition-colors ease-in-out`}
            >
              <PlusCircle />
            </ContentMenu.Button>
          </table>
          <div css={[tw`mt-lg p-sm border text-gray-700`]}>
            <TextArea
              injectedValue={notes}
              onBlur={(notes) => updateTableNotes({ notes })}
              placeholder="Optional table notes..."
            />
          </div>
        </>
      )}
    </ContainerUtility.isHovered>
  );
}
