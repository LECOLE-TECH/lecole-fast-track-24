import { FormProvider, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { productSchema, type EditingProduct, type Product } from "~/lib/types"
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "~/components/ui/form"
import { Input } from "~/components/ui/input"
import { Textarea } from "~/components/ui/textarea"
import { Button } from "~/components/ui/button"
import { useState } from "react"

interface ProductFormProps{
    product?:Product
    onSubmit: (product: EditingProduct) => Promise<void>
    isEditing?:boolean,
    submitText?:string
}

const ProductForm = ({product,onSubmit,isEditing=true,submitText="Add"}:ProductFormProps)=>{
    const [isLoading,setIsLoading] = useState(false)
    const form = useForm<EditingProduct>({
        resolver: zodResolver(productSchema),
        defaultValues: product || {
            name: "",
            description: "",
            price: 1,
            stock: 1,
        },
    })

    const handleSubmit =async (v:EditingProduct) => {
        setIsLoading(true)
        try{
            await onSubmit(v)
        }
        catch(err){
            console.log(err)
        }
        setIsLoading(false)
    }
    
    return (
        <FormProvider {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="mx-auto w-full flex flex-col gap-2">
                <FormField
                    control={form.control}
                    name="name"
                    render={({field})=>(
                        <FormItem>
                            <div className="flex align-middle gap-2">
                                <FormLabel className={!isEditing?"hidden":""}>Product name</FormLabel>
                                <FormMessage className="text-xs opacity-70"/>
                            </div>
                            <FormControl>
                                <Input className={!isEditing?"border-none shadow-none !opacity-100 !cursor-default p-0 font-bold text-lg":""}
                                    placeholder={!isEditing?"":"Enter product name"} 
                                    disabled={!isEditing} 
                                    {...field}>
                                </Input>
                            </FormControl>
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="description"
                    render={({field})=>(
                        <FormItem>
                            <div className="flex align-middle gap-2">
                                <FormLabel className={!isEditing?"hidden":""}>Description</FormLabel>
                                <FormMessage className="text-xs opacity-70"/>
                            </div>
                            <FormControl>
                                <Textarea
                                    className={`resize-none h-28 ${!isEditing?"border-none shadow-none !opacity-100 !cursor-default p-0":""}`}
                                    disabled={!isEditing}
                                    placeholder={!isEditing?"":"Enter product description"} 
                                    {...field}
                                />
                            </FormControl>
                        </FormItem>
                    )}
                />
                <div className="flex gap-2 flex-col sm:flex-row">
                    <FormField
                        control={form.control}
                        name="price"
                        render={({field})=>(
                            <FormItem className="flex-1">
                                <div className="flex align-middle gap-2">
                                    <FormLabel>Price</FormLabel>
                                    <FormMessage className="text-xs opacity-70"/>
                                </div>
                                <FormControl>
                                    <Input
                                        type="number"
                                        placeholder={!isEditing?"":"Enter price"} 
                                        {...field}
                                        onChange={(e) => field.onChange(parseFloat(e.target.value))}
                                        disabled={!isEditing}
                                        className={!isEditing?"border-none shadow-none !opacity-100 !cursor-default p-0":""}
                                    />
                                </FormControl>
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="stock"
                        render={({field})=>(
                            <FormItem className="flex-1">
                                <div className="flex align-middle gap-2">
                                    <FormLabel>Stock</FormLabel>
                                    <FormMessage className="text-xs opacity-70"/>
                                </div>
                                <FormControl>
                                    <Input
                                        type="number"
                                        placeholder={!isEditing?"":"Enter stock quantity"} 
                                        {...field}
                                        onChange={(e) => field.onChange(parseInt(e.target.value))}
                                        disabled={!isEditing}
                                        className={!isEditing?"border-none shadow-none !opacity-100 !cursor-default p-0":""}
                                    />
                                </FormControl>
                            </FormItem>
                        )}
                    />
                </div>
                {isEditing?
                    <Button type="submit" className={`w-full ${isLoading?"bg-white text-black cursor-default":""}`}>
                        {isLoading?"Loading...":submitText}
                    </Button>
                :<></>}
            </form>
        </FormProvider>
    )
}


export default ProductForm 