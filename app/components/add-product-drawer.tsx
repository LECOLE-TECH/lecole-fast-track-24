import * as React from "react"
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerFooter } from "./ui/drawer"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Label } from "./ui/label"
import { Textarea } from "./ui/textarea"
import { postProduct } from "@/routes/apiForProducts/getProduct"
interface AddProductDrawerProps {
    isOpen: boolean
    onClose: () => void
    onSubmit: (product:any) => void
}
export function AddProductDrawer({ isOpen, onClose, onSubmit }: AddProductDrawerProps) {
    const [name, setName] = React.useState("")
    const [description, setDescription] = React.useState("")
    const [price, setPrice] = React.useState("")
    const [stock, setStock] = React.useState("")

   const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const product = {
            name,
            description,
            price: parseFloat(price),
            stock: parseInt(stock, 10)
        };

        try {
            const response = await postProduct(product);
            console.log("Product added:", response);
            onSubmit(product);
        } catch (error) {
            console.error("Error adding product:", error);
        }
        onClose()
        // Reset form
        setName("")
        setDescription("")
        setPrice("")
        setStock("")
    }

    return (
        <Drawer open={isOpen} onClose={onClose}>
            <DrawerContent>
                <DrawerHeader>
                    <DrawerTitle>Add New Product</DrawerTitle>
                </DrawerHeader>
                <form onSubmit={handleSubmit} className="p-4 space-y-4">
                    <div>
                        <Label htmlFor="name">Name</Label>
                        <Input
                            id="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <Label htmlFor="description">Description</Label>
                        <Textarea
                            id="description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <Label htmlFor="price">Price</Label>
                        <Input
                            id="price"
                            type="number"
                            step="0.01"
                            value={price}
                            onChange={(e) => setPrice(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <Label htmlFor="stock">Stock</Label>
                        <Input
                            id="stock"
                            type="number"
                            value={stock}
                            onChange={(e) => setStock(e.target.value)}
                            required
                        />
                    </div>
                    <DrawerFooter>
                        <Button type="submit">Add Product</Button>
                        <Button variant="outline" onClick={onClose}>Cancel</Button>
                    </DrawerFooter>
                </form>
            </DrawerContent>
        </Drawer>
    )
}

