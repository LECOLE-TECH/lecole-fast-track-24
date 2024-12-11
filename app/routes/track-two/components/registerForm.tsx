import { FormProvider, useForm } from "react-hook-form"
import { newUserSchema, type newUser } from "../utils/types"
import type { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "~/components/ui/form"
import { Input } from "~/components/ui/input"
import { Button } from "~/components/ui/button"
import { useCallback } from "react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/select"


export const RegisterForm = ({onSubmit}:{onSubmit:(newUser:newUser)=>Promise<boolean>})=>{
    const form = useForm<z.infer<typeof newUserSchema>>({
        resolver: zodResolver(newUserSchema)
    })

    const handleSubmit = useCallback(async (user: z.infer<typeof newUserSchema>)=>{
        const res=await onSubmit({...user})
        if(res)form.reset()
    },[onSubmit]) 

    return <FormProvider {...form}>
    <form className="flex flex-col gap-3" onSubmit={form.handleSubmit(handleSubmit)}>
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
        <FormField
            name="roles"
            control={form.control}
            render={({field})=>(
                <FormItem>
                    <div className="flex gap-2">
                        <FormLabel>Role</FormLabel>
                        <FormMessage className="text-xs opacity-60"></FormMessage>
                    </div>
                    <Select onValueChange={field.onChange} value={field.value}>
                        <SelectTrigger>
                            <SelectValue placeholder="Select an option" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="user">User</SelectItem>
                            <SelectItem value="admin">Admin</SelectItem>
                        </SelectContent>
                    </Select>
                </FormItem>
            )}
        />
        <Button className="w-full" type="submit">Register</Button>
    </form>
</FormProvider>
}
