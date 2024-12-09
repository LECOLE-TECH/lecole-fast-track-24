import { Card } from "~/components/ui/card"
import type { EditingProduct, Product } from "~/lib/types"
import ProductForm from "./ProductForm"
import { useState } from "react"
import { Button } from "~/components/ui/button"


interface ProductCardProps{
    product: Product
    onDelete: (id:number) =>void
    onUpdate: (product: EditingProduct,productId:number) => Promise<void>
}


const ProductCard = ({product,onDelete,onUpdate}:ProductCardProps)=>{
    const [isEditing,setIsEditing] = useState(false)


    return (
        <Card className="max-w-full p-4 md:max-w-sm ">
            <div className="flex gap-2 justify-end">
                <Button 
                    className="text-xs" 
                    variant="outline" 
                    onClick={() => setIsEditing(!isEditing)}>
                    Edit
                </Button>
                <Button className="text-xs" 
                    variant="destructive" 
                    onClick={() => onDelete(product.id)}>
                    Delete
                </Button>
            </div>
            <ProductForm 
                product={product}
                onSubmit={(p)=>onUpdate(p,product.id)}
                isEditing={isEditing}
                submitText="Update"
            ></ProductForm>
        </Card>
    )
}

export default ProductCard;