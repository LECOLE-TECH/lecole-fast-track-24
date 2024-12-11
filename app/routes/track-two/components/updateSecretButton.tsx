import { FormProvider, useForm } from "react-hook-form"
import type { z } from "zod"
import { updateSecretSchema } from "../utils/types"
import { zodResolver } from "@hookform/resolvers/zod"
import { useCallback, useState } from "react"
import { Button } from "~/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "~/components/ui/dialog"
import { FormField, FormItem, FormLabel, FormMessage, FormControl } from "~/components/ui/form"
import { Input } from "~/components/ui/input"



export const UpdateSecretButton = ({username,currentSecretPhrase,onSubmit}:{username:string,currentSecretPhrase:string,onSubmit:(username:string,secretPhrase:string)=>Promise<boolean>})=>{
    const [isOpen, setIsOpen] = useState(false)
    
    const form = useForm<z.infer<typeof updateSecretSchema>>({
        resolver: zodResolver(updateSecretSchema)
    })

    const handleSubmit = useCallback(async(v:z.infer<typeof updateSecretSchema>)=>{
        const res = await onSubmit(username,v.secretPhrase)
        if(res){
            form.reset()
            setIsOpen(false)
        }
    },[username])

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button variant={"outline"}>
                    Update secret
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Update secret for {username}</DialogTitle>
                </DialogHeader>
                <p>Current secret: {currentSecretPhrase}</p>
                <FormProvider {...form}>
                    <form className="flex flex-col gap-3" onSubmit={form.handleSubmit(handleSubmit)}>
                    <FormField
                        control={form.control}
                        name={"secretPhrase"}
                        render={({field})=>(
                            <FormItem>
                                <div className="flex gap-2">
                                    <FormLabel>Secret phrase</FormLabel>
                                    <FormMessage className="text-xs opacity-60"></FormMessage>
                                </div>
                                <FormControl>
                                    <Input {...field}/>
                                </FormControl>
                            </FormItem>
                        )}
                    />
                    <Button className="w-full" type="submit">Update</Button>
                    </form>
                </FormProvider>
            </DialogContent>
        </Dialog>
    )
}