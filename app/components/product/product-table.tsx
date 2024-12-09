import { useState, useCallback } from "react";
import {
  type ColumnDef,
  type ColumnFiltersState,
  type SortingState,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  TableData,
  TableSortingCol,
  TableFilterRow,
  TablePagination,
} from "~/components/common/table";
import type { Product } from "~/lib/model";
import type { ActionType } from "./product-action";
import { ProductAction } from "./product-action";
import { Button } from "~/components/ui/button";
import { ProductAlert } from "./product-alert";

const columns: ColumnDef<Product>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => {
      return <TableSortingCol column={column} by="name" />;
    },
  },
  {
    accessorKey: "description",
    header: "Description",
  },
  {
    accessorKey: "price",
    header: ({ column }) => {
      return <TableSortingCol column={column} by="price" />;
    },
  },
  {
    accessorKey: "stock",
    header: ({ column }) => {
      return <TableSortingCol column={column} by="stock" />;
    },
  },
  {
    accessorKey: "action",
    header: "Action",
  },
];

import { useMemo } from "react";

export const ProductTable = ({ products }: { products: Product[] }) => {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [actionType, setActionType] = useState<ActionType | null>(null);

  const openAlert = useCallback((actionType: ActionType, product: Product) => {
    setSelectedProduct(product);
    setActionType(actionType);
  }, []);

  const closeAlert = useCallback(() => {
    setSelectedProduct(null);
    setActionType(null);
  }, []);

  const newColumns: ColumnDef<Product>[] = useMemo(() => {
    return columns.map((column) => {
      if (column.header === "Action") {
        return {
          ...column,
          cell: ({ row }) => {
            const product = row.original;
            return (
              <ProductAction
                onEdit={() => openAlert("edit", product)}
                onDelete={() => openAlert("delete", product)}
              />
            );
          },
        };
      }
      return column;
    });
  }, [sorting, columnFilters]);

  const table = useReactTable({
    data: products,
    columns: newColumns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      sorting,
      columnFilters,
    },
  });

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className=" text-2xl font-bold w-full">Product List</h1>
        <Button onClick={() => openAlert("create", {} as Product)}>
          Create Product
        </Button>
      </div>

      {/* Action */}
      <div className="flex justify-between items-center gap-2">
        <TableFilterRow table={table} by="name" />
        <TablePagination table={table} />
      </div>

      {/* Table */}
      <TableData table={table} />

      {/* AlertAlert Action */}
      {selectedProduct && actionType && (
        <ProductAlert
          actionType={actionType}
          selectedProduct={selectedProduct}
          closeAlert={closeAlert}
        />
      )}
    </div>
  );
};
