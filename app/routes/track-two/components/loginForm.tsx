import { FormProvider, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import type { z } from "zod"
import { loginUserSchema } from "../utils/types"
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "~/components/ui/form"
import { Input } from "~/components/ui/input"
import { Button } from "~/components/ui/button"
import { useCallback } from "react"


export const LoginForm = ({onSubmit}:{onSubmit:(username:string,secretPhrase:string)=>Promise<boolean>})=>{
    const form = useForm<z.infer<typeof loginUserSchema>>({
        resolver: zodResolver(loginUserSchema)
    })

    const handleSubmit = useCallback(async (user: z.infer<typeof loginUserSchema>)=>{
        const res = await onSubmit(user.username,user.secretPhrase)
        if(res) form.reset()
    },[onSubmit]) 

    return <FormProvider {...form}>
        <form  className="flex flex-col gap-3" onSubmit={form.handleSubmit(handleSubmit)}>
            <FormField
                control={form.control}
                name={"username"}
                render={({field})=>(
                    <FormItem>
                        <div className="flex gap-2">
                            <FormLabel>Username</FormLabel>
                            <FormMessage className="text-xs opacity-60"></FormMessage>
                        </div>
                        <FormControl>
                            <Input {...field}/>
                        </FormControl>
                    </FormItem>
                )}
            />
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
            <Button className="w-full" type="submit">Login</Button>
        </form>
    </FormProvider>
}