export interface Product {
  id?: number;
  name: string;
  description?: string;
  price: number;
  stock: number;

}

export interface ProductApi {
  get: () => Promise<Product[]>;
  post: (product: Product) => Promise<Product>;  
  delete: (id: number) => Promise<void>;
  patch: (id: number, product: Product) => Promise<Product>;
}
