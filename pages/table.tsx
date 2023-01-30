import { produce } from "immer";
import { PlusCircle, TextAa, Trash } from "phosphor-react";
import { useState } from "react";
import { Column, useTable } from "react-table";
import tw from "twin.macro";
import WithTooltip from "^components/WithTooltip";
import TextArea from "^components/editors/TextArea";

const Table = () => {
  const [data, setData] = useState([{ col1: "", col2: "" }]);
  const [columns, setColumns] = useState<Array<Column>>([
    { Header: "", accessor: "col1" },
    { Header: "", accessor: "col2" },
  ]);
  const [col1IsTitular, setCol1IsTitular] = useState(true);
  const [notes, setNotes] = useState("");
  const [title, setTitle] = useState("");

  const addRow = () => {
    setData((data) => {
      const newRowArr = columns.map((column) => [column.accessor, ""]);
      const newRow = Object.fromEntries(newRowArr);

      return [...data, newRow];
    });
  };
  const deleteRow = (index: number) => {
    const updated = produce(data, (draft) => {
      draft.splice(index, 1);
    });
    setData(updated);
  };

  const addColumn = (colNum: number) => {
    const newAccessor = `col${colNum}`;
    setColumns((columns) => [
      ...columns,
      { Header: "", accessor: newAccessor },
    ]);
    setData((data) => data.map((row) => ({ ...row, [newAccessor]: "" })));
  };
  const deleteColumn = (index: number) => {
    const updatedColumns = produce(columns, (draft) => {
      draft.splice(index, 1);
      draft.forEach((column, i) => {
        column.accessor = `col${i + 1}`;
      });
    });
    setColumns(updatedColumns);

    const deletedColumnAccessor = columns[index].accessor;

    const updatedData = produce(data, (draft) => {
      draft.forEach((row) => {
        delete row[deletedColumnAccessor as keyof typeof row];
      });
      draft.forEach((row, i) => {
        const rowKeys = Object.keys(row) as (keyof typeof row)[];
        const rowKeysUpdated = rowKeys.map((_key, i) => `col${i + 1}`);
        const rowArrUpdated = rowKeysUpdated.map((rowKeyUpdated, i) => [
          rowKeyUpdated,
          row[rowKeys[i]],
        ]);
        const rowUpdated = Object.fromEntries(rowArrUpdated);

        draft[i] = rowUpdated;
      });
    });
    setData(updatedData);
  };

  const updateHeaderText = ({
    colIndex,
    text,
  }: {
    colIndex: number;
    text: string;
  }) => {
    setColumns((columns) => {
      const updated = produce(columns, (draft) => {
        draft[colIndex].Header = text;
      });

      return updated;
    });
  };

  const updateCellText = ({
    colAccessor,
    rowIndex,
    text,
  }: {
    colAccessor: string;
    rowIndex: number;
    text: string;
  }) => {
    setData((data) => {
      const updated = produce(data, (draft) => {
        const row = draft[rowIndex];
        row[colAccessor as keyof typeof row] = text;
      });

      return updated;
    });
  };

  const tableInstance = useTable({ columns, data });

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    tableInstance;

  return (
    <div css={[tw`h-screen pl-xl pt-xl`]}>
      <div css={[tw`inline-block max-w-[800px] overflow-x-auto pb-md`]}>
        <div>
          <TextArea
            injectedValue={title}
            onBlur={setTitle}
            placeholder="Optional title..."
          />
        </div>
        <table {...getTableProps()} css={[tw`relative pt-xl ml-md mt-lg`]}>
          <thead>
            {headerGroups.map((headerGroup, i) => (
              <tr {...headerGroup.getHeaderGroupProps()} key={i}>
                {headerGroup.headers.map((column, columnIndex) => {
                  const textLength = column.render("Header")?.toString().length;

                  return (
                    <th
                      {...column.getHeaderProps()}
                      css={[
                        tw`relative border py-xs px-sm`,
                        !textLength ? tw`text-gray-placeholder` : tw``,
                      ]}
                      key={columnIndex}
                    >
                      <input
                        type="text"
                        placeholder={`Header ${columnIndex + 1}...`}
                        value={column.render("Header")?.toString()}
                        onChange={(e) =>
                          updateHeaderText({
                            colIndex: columnIndex,
                            text: e.target.value,
                          })
                        }
                        css={[
                          col1IsTitular && columnIndex === 0
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
                            onClick={() => deleteColumn(columnIndex)}
                            css={[
                              tw`absolute left-1/2 -translate-x-1/2 -top-xs -translate-y-full text-black`,
                            ]}
                            type="button"
                          >
                            <Trash />
                          </button>
                        </WithTooltip>
                      ) : null}
                      {columnIndex === 0 ? (
                        <div
                          onClick={() => setCol1IsTitular(!col1IsTitular)}
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
                            updateCellText({
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
                              onClick={() => deleteRow(rowIndex)}
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
              onClick={() => addColumn(columns.length + 1)}
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
              onClick={() => addRow()}
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
            onBlur={setNotes}
            placeholder="table notes"
          />
        </div>
      </div>
    </div>
  );
};

export default Table;
