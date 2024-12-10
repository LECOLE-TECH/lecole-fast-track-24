import z from "zod"

export const insertProductSchema = z.object({
  name: z
    .string()
    .min(3, { message: "Product name must be at least 3 characters." })
    .max(256, { message: "Product name must be at most 256 characters." })
    .nonempty({ message: "Product name is required." }),

  description: z
    .string()
    .min(3, { message: "Product description must be at least 3 characters." })
    .max(256, {
      message: "Product description must be at most 256 characters."
    })
    .nonempty({ message: "Product description is required." }),

  price: z
    .number()
    .positive({ message: "Price must be greater than zero" })
    .multipleOf(0.01, { message: "Price can have up to 2 decimal places" }),

  stock: z
    .number()
    .positive({ message: "Stock must be greater than zero" })
    .multipleOf(0.01, { message: "Stock can have up to 2 decimal places" }),

  category: z.string().nonempty({ message: "Category is required." }),

  brand: z.string().nonempty({ message: "Branch is required." })
})

export const editProductSchema = insertProductSchema

export type InsertProduct = z.infer<typeof insertProductSchema>
export type EditProduct = z.infer<typeof editProductSchema>
