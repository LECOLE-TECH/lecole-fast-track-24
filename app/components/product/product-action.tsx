import { useState } from "react";
import { useForm } from "react-hook-form";
import { MoreHorizontal, Loader2 } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import type { Product } from "~/lib/model";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import { createProduct, updateProduct, deleteProduct } from "~/lib/api";
import { memo } from "react";

export type ActionType = "create" | "edit" | "delete";

export const ProductAction = memo(
  ({ onEdit, onDelete }: { onEdit: () => void; onDelete: () => void }) => {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            className="w-full h-full cursor-pointer"
            onClick={onEdit}
          >
            Edit
          </DropdownMenuItem>
          <DropdownMenuItem
            className="w-full h-full cursor-pointer"
            onClick={onDelete}
          >
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }
);

const createProductSchema = z.object({
  name: z.string().min(1).max(255),
  description: z.string().min(1).max(255),
  price: z
    .string()
    .regex(/^\d+(\.\d+)?$/, "Price must be a valid number.")
    .transform((val) => parseFloat(val))
    .refine((val) => !isNaN(val) && val >= 0),
  stock: z
    .string()
    .regex(/^\d+(\.\d+)?$/, "Stock must be a valid number.")
    .transform((val) => parseInt(val))
    .refine((val) => !isNaN(val) && val >= 0),
});

export const CreateProduct = ({ closeAlert }: { closeAlert: () => void }) => {
  const [loading, setLoading] = useState<boolean>(false);
  const form = useForm<z.infer<typeof createProductSchema>>({
    resolver: zodResolver(createProductSchema),
  });

  const onSubmit = async (values: z.infer<typeof createProductSchema>) => {
    setLoading(true);
    await createProduct({ id: "0", ...values });
    setLoading(false);
    closeAlert();
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="Product name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Input placeholder="Product description" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="price"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Price</FormLabel>
              <FormControl>
                <Input placeholder="Ex: 99.9" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="stock"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Stock</FormLabel>
              <FormControl>
                <Input placeholder="Ex: 100" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={closeAlert} disabled={loading}>
            Cancel
          </Button>
          <Button type="submit" disabled={loading}>
            {loading && <Loader2 className="animate-spin" />}
            Submit
          </Button>
        </div>
      </form>
    </Form>
  );
};

const updateProductSchema = z.object({
  name: z.string().min(1).max(255),
  description: z.string().min(1).max(255),
  price: z
    .union([z.string(), z.number()])
    .transform((val) => (typeof val === "string" ? parseFloat(val) : val))
    .refine((val) => !isNaN(val) && val >= 0, "Price must be a valid number."),
  stock: z
    .union([z.string(), z.number()])
    .transform((val) => (typeof val === "string" ? parseInt(val) : val))
    .refine((val) => !isNaN(val) && val >= 0, "Stock must be a valid number."),
});

export const UpdateProduct = ({
  product,
  closeAlert,
}: {
  product: Product;
  closeAlert: (close: boolean) => void;
}) => {
  const [loading, setLoading] = useState<boolean>(false);
  const form = useForm<z.infer<typeof updateProductSchema>>({
    resolver: zodResolver(updateProductSchema),
    defaultValues: {
      name: product.name,
      description: product.description,
      price: product.price,
      stock: product.stock,
    },
  });

  const onSubmit = async (values: z.infer<typeof updateProductSchema>) => {
    console.log("values", values);
    setLoading(true);
    await updateProduct({ ...product, ...values });
    setLoading(false);
    closeAlert(true);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="Product name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Input placeholder="Product description" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="price"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Price</FormLabel>
              <FormControl>
                <Input placeholder="Ex: 99.9" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="stock"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Stock</FormLabel>
              <FormControl>
                <Input placeholder="Ex: 100" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-2">
          <Button
            variant="outline"
            onClick={() => closeAlert(true)}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={loading}>
            {loading && <Loader2 className="animate-spin" />}
            Submit
          </Button>
        </div>
      </form>
    </Form>
  );
};

export const DeleteProduct = ({
  id,
  closeAlert,
}: {
  id: string;
  closeAlert: (close: boolean) => void;
}) => {
  const [loading, setLoading] = useState<boolean>(false);
  const handleDelete = async () => {
    setLoading(true);
    await deleteProduct(id);
    setLoading(false);
    closeAlert(true);
  };

  return (
    <div className="flex justify-end gap-2">
      <Button
        variant="outline"
        onClick={() => closeAlert(true)}
        disabled={loading}
      >
        Cancel
      </Button>
      <Button type="submit" disabled={loading} onClick={handleDelete}>
        {loading && <Loader2 className="animate-spin" />}
        Submit
      </Button>
    </div>
  );
};
