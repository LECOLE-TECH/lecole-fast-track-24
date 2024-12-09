import z from "zod"
export const insertProductsSchema = z.object({
  name: z
    .string()
    .min(3, {
      message: "Product name must be at least 3 characters."
    })
    .max(256, {
      message: "Product name must be at most 256 characters."
    })
    .nonempty({
      message: "Product name is required."
    }),

  description: z
    .string()
    .min(3, {
      message: "Product description must be at least 3 characters."
    })
    .max(256, {
      message: "Product description must be at most 256 characters."
    })
    .nonempty({
      message: "Product description is required."
    }),
  price: z.number().int().positive(),
  stock: z.number().int().positive(),
  category: z.string().nonempty(),
  branch: z.string().nonempty()
})

export const updateProductsSchema = insertProductsSchema.partial()
