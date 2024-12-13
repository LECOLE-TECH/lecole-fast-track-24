const ProfileForm = () => {
  return <div></div>
}

export default ProfileForm
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Button } from "~/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "~/components/ui/form"

import { Input } from "~/components/ui/input"
import { secretSchema, SecretUser } from "~/utils/schema"

interface props {
  currentSecret: string
  onChangeSecret: (data: SecretUser) => void
}

export const SecretForm = ({ onChangeSecret, currentSecret }: props) => {
  const form = useForm<SecretUser>({
    resolver: zodResolver(secretSchema),
    defaultValues: {
      secret: currentSecret
    }
  })

  function onSubmit(values: SecretUser) {
    onChangeSecret(values)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="secret"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Secret</FormLabel>
              <FormControl>
                <Input placeholder="Enter new secret" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button className="w-full" type="submit">
          Change Secret
        </Button>
      </form>
    </Form>
  )
}
