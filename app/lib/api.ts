import { type Product, type EditingProduct, type ProductListRespond } from './types'

const API_URL =  'http://localhost:3000/api'

export async function fetchProducts({page=1,limit=6}:{page?:number,limit?:number}): Promise<ProductListRespond> {
  const res = await fetch(`${API_URL}/products?page=${page}&limit=${limit}`, { cache: 'no-store' })
  if (!res.ok) throw new Error('Failed to fetch products')
  return res.json()
}

export async function createProduct(product: EditingProduct): Promise<Product> {
  const res = await fetch(`${API_URL}/products`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(product),
  })
  if (!res.ok) throw new Error('Failed to create product')
  return res.json()
}

export async function updateProduct(product: Product): Promise<Product> {
  const res = await fetch(`${API_URL}/products/${product.id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(product),
  })
  if (!res.ok) throw new Error('Failed to update product')
  return res.json()
}

export async function deleteProduct(id: number): Promise<void> {
  const res = await fetch(`${API_URL}/products/${id}`, { method: 'DELETE' })
  if (!res.ok) throw new Error('Failed to delete product')
}

