import { ArrowUpDown } from "lucide-react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import {
  type Table as TableType,
  type Column,
  flexRender,
} from "@tanstack/react-table";

export const TableData = ({ table }: { table: TableType<any> }) => {
  const columns = table.getHeaderGroups()[0].headers;
  return (
    <Table>
      <TableHeader>
        {table.getHeaderGroups().map((headerGroup) => (
          <TableRow key={headerGroup.id}>
            {headerGroup.headers.map((header) => {
              return (
                <TableHead key={header.id}>
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                </TableHead>
              );
            })}
          </TableRow>
        ))}
      </TableHeader>
      <TableBody>
        {table.getRowModel().rows?.length ? (
          table.getRowModel().rows.map((row) => (
            <TableRow
              key={row.id}
              data-state={row.getIsSelected() && "selected"}
            >
              {row.getVisibleCells().map((cell) => (
                <TableCell key={cell.id}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </TableCell>
              ))}
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell colSpan={columns.length} className="h-24 text-center">
              No results.
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
};

export const TableSortingCol = ({
  column,
  by,
}: {
  column: Column<any, any>;
  by: string;
}) => {
  return (
    <Button
      className="px-0"
      variant="ghost"
      onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
    >
      {by}
      <ArrowUpDown className="ml-2 h-4 w-4" />
    </Button>
  );
};

export const TableFilterRow = ({
  table,
  by,
}: {
  table: TableType<any>;
  by: string;
}) => {
  return (
    <Input
      className="max-w-sm"
      placeholder={`Filter by ${by}`}
      value={(table.getColumn(by)?.getFilterValue() as string) ?? ""}
      onChange={(event) =>
        table.getColumn(by)?.setFilterValue(event.target.value)
      }
    />
  );
};

export const TablePagination = ({ table }: { table: TableType<any> }) => {
  return (
    <div className="flex items-center justify-end space-x-2 py-4">
      <Button
        variant="outline"
        size="sm"
        onClick={() => table.previousPage()}
        disabled={!table.getCanPreviousPage()}
      >
        Previous
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={() => table.nextPage()}
        disabled={!table.getCanNextPage()}
      >
        Next
      </Button>
    </div>
  );
};
