import * as React from "react"
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerFooter } from "@/components/ui/drawer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

interface Product {
    id: number
    name: string
    description: string
    price: number
    stock: number
}

interface UpdateProductDrawerProps {
    isOpen: boolean
    onClose: () => void
    onUpdate: (product: Product) => void
    product: Product | null
}

export function UpdateProductDrawer({ isOpen, onClose, onUpdate, product }: UpdateProductDrawerProps) {
    const [name, setName] = React.useState("")
    const [description, setDescription] = React.useState("")
    const [price, setPrice] = React.useState("")
    const [stock, setStock] = React.useState("")

    React.useEffect(() => {
        if (product) {
            setName(product.name)
            setDescription(product.description)
            setPrice(product.price.toString())
            setStock(product.stock.toString())
        }
    }, [product])

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (product) {
            onUpdate({
                id: product.id,
                name,
                description,
                price: parseFloat(price),
                stock: parseInt(stock, 10)
            })
        }
        onClose()
    }

    return (
        <Drawer open={isOpen} onClose={onClose}>
            <DrawerContent>
                <DrawerHeader>
                    <DrawerTitle>Update Product</DrawerTitle>
                </DrawerHeader>
                <form onSubmit={handleSubmit} className="p-4 space-y-4">
                    <div>
                        <Label htmlFor="update-name">Name</Label>
                        <Input
                            id="update-name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <Label htmlFor="update-description">Description</Label>
                        <Textarea
                            id="update-description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <Label htmlFor="update-price">Price</Label>
                        <Input
                            id="update-price"
                            type="number"
                            step="0.01"
                            value={price}
                            onChange={(e) => setPrice(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <Label htmlFor="update-stock">Stock</Label>
                        <Input
                            id="update-stock"
                            type="number"
                            value={stock}
                            onChange={(e) => setStock(e.target.value)}
                            required
                        />
                    </div>
                    <DrawerFooter>
                        <Button type="submit">Update Product</Button>
                        <Button variant="outline" onClick={onClose}>Cancel</Button>
                    </DrawerFooter>
                </form>
            </DrawerContent>
        </Drawer>
    )
}

