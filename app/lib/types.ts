import { z } from "zod"



export const productSchema = z.object({
  name: z.string().min(1, "(Name is required)"),
  description: z.string().min(1,"(Description is required)"),
  price: z.number().min(1, "(Price must be a positive number)"),
  stock: z.number().int().min(1, "(Stock must be a positive integer)"),
})

export interface Product {
  id: number
  name: string
  description: string
  price: number
  stock: number
}

export interface ProductListRespond{
  data: Product[],
  pagination: {
    totalItems: number
    totalPages: number
    currentPage: number
    itemsPerPage: number
  }
}


export type EditingProduct = Omit<Product, 'id'>
  
export interface Alert {
  alertId: string;
  status: "success" | "error" | "info";
  msg: string;
}
  