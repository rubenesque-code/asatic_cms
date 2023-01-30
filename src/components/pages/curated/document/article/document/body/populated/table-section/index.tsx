import tw from "twin.macro";
import { useTable } from "react-table";

import TextArea from "^components/editors/TextArea";
import ArticleTableSectionSlice from "^context/articles/ArticleTableSectionContext";

import { PlusCircle, TextAa } from "phosphor-react";
import SectionMenu_ from "../_containers/SectionMenu_";
import ContainerUtility from "^components/ContainerUtilities";
import ContentMenu from "^components/menus/Content";
import { RemoveRelatedEntityIcon } from "^components/Icons";

export default function TableSection() {
  const [
    {
      id: sectionId,
      index: sectionIndex,
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
  ] = ArticleTableSectionSlice.useContext();

  const tableInstance = useTable({ columns, data });

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    tableInstance;

  return (
    <ContainerUtility.isHovered
      styles={tw`relative inline-block max-w-full overflow-x-auto pb-md my-md`}
    >
      {(containerIsHovered) => (
        <>
          <SectionMenu_
            isShowing={containerIsHovered}
            sectionId={sectionId}
            sectionIndex={sectionIndex}
          />
          <div>
            <TextArea
              injectedValue={title}
              onBlur={(title) => updateTableTitle({ title })}
              placeholder="Optional table title..."
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
                            <div css={[]}>
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
                            </div>
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
          <div css={[tw`mt-lg p-sm border`]}>
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
