import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@repo/ui/components/ui/form'
import { Input } from '@repo/ui/components/ui/input'
import { Button } from '@repo/ui/components/ui/button'
import { toast } from 'sonner'
import { handleReturnInfo } from '@/lib/utils'
import { changePassword } from '@/lib/supabase/auth'
import {
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@repo/ui/components/ui/dialog'

const formSchema = z
  .object({
    password: z
      .string({ required_error: 'Please enter your password' })
      .min(6, 'Please enter a password with at least 6 characters'),
    confirm: z.string({ required_error: 'Please confirm your password' }),
  })
  .refine((data) => data.password === data.confirm, {
    message: "Passwords don't match",
    path: ['confirm'],
  })

type SchemaType = z.infer<typeof formSchema>

export default function PasswordDialogContent({
  setDialogOpen,
}: {
  setDialogOpen: (value: boolean) => void
}) {
  const form = useForm<SchemaType>({
    resolver: zodResolver(formSchema),
    mode: 'onBlur',
  })

  async function onSubmit(data: SchemaType) {
    const res = await changePassword(data.password)
    handleReturnInfo(res, () => {
      form.reset()
    })
    setDialogOpen(false)
  }

  function onError(error: unknown) {
    console.log(error)
    toast.error('Error with inputs')
  }
  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Change Password</DialogTitle>
        <DialogDescription>
          Create a new secure password for your account.
        </DialogDescription>
      </DialogHeader>
      <Form {...form}>
        <form
          id="loginForm"
          onSubmit={form.handleSubmit(onSubmit, onError)}
          className="w-full space-y-2 py-3"
        >
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>New Password</FormLabel>
                <FormControl>
                  <Input type="password" className="h-9" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="confirm"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Confirm Password</FormLabel>
                <FormControl>
                  <Input type="password" className="h-9" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </form>
      </Form>
      <DialogFooter>
        <Button
          className="mt-4 h-9"
          type="submit"
          form="loginForm"
          disabled={!form.formState.isValid}
        >
          Submit
        </Button>
      </DialogFooter>
    </DialogContent>
  )
}
