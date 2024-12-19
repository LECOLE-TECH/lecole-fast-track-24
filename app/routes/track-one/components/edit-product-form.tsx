import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Product } from "~/types/products.types"
import { EditProduct, editProductSchema } from "~/utils/schema"
import { Button } from "~/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "~/components/ui/form"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "~/components/ui/select"
import { Input } from "~/components/ui/input"
import { DUMMY_CATEROGY } from "~/utils/constant"
import { useState } from "react"
import { toast } from "react-toastify"

interface props {
  product: Product
  onEdit: (data: Product) => void
}
export const EditProductForm = ({ product, onEdit }: props) => {
  const [initialValues, _] = useState<EditProduct>({
    name: product.name,
    description: product.description,
    price: product.price,
    stock: product.stock,
    category: product.category,
    brand: product.brand
  })

  const form = useForm<EditProduct>({
    resolver: zodResolver(editProductSchema),
    defaultValues: initialValues
  })

  function onSubmit(values: EditProduct) {
    if (JSON.stringify(values) !== JSON.stringify(initialValues)) {
      onEdit({ ...product, ...values })
    } else {
      toast.warning(
        "No changes detected. Please make some changes to update the product."
      )
    }
  }

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
                <Input placeholder="Enter product name" {...field} />
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
                <Input placeholder="Enter product description" {...field} />
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
                <Input
                  type="number"
                  step="0.01"
                  placeholder="Enter price (e.g., 99.20 -> $99.20)"
                  {...field}
                  value={field.value || ""}
                  onChange={(e) => {
                    const value = parseFloat(e.target.value)
                    field.onChange(isNaN(value) ? undefined : value)
                  }}
                />
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
                <Input
                  type="number"
                  placeholder="Enter stock quantity"
                  {...field}
                  value={field.value || ""}
                  onChange={(e) => field.onChange(e.target.valueAsNumber)}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="category"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Category</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select product category" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {DUMMY_CATEROGY.map((category) => (
                    <SelectItem
                      key={category}
                      value={category}
                      className="cursor-pointer"
                    >
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="brand"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Brand</FormLabel>
              <FormControl>
                <Input placeholder="Enter brand name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          className="w-full"
          type="submit"
          disabled={
            JSON.stringify(form.getValues()) === JSON.stringify(initialValues)
          }
        >
          Edit Product
        </Button>
      </form>
    </Form>
  )
}
