import { Fragment, useMemo } from "react"
import { Card } from "~/components/ui/card"
import type { EditingProduct, Product } from "~/lib/types"
import ProductCard from "./ProductCard"


interface ProductListProps{
    products: Product[]
    onDelete: (id:number) =>void
    onUpdate: (product: EditingProduct,productId:number) => Promise<void>
}

const ProductCardList = ({ products, onDelete, onUpdate }: ProductListProps)=>{
    
    
    return (
        <div className="flex max-w-full gap-2 flex-wrap justify-center md:justify-normal">
            {products.map(p=>(
                <Fragment key={p.id}>
                    <ProductCard
                        product={p}
                        onDelete={onDelete}
                        onUpdate={onUpdate}
                    />
                </Fragment>
            ))}
        </div>
    )
}

export default ProductCardList