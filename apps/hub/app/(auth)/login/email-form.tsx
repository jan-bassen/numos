import { Button } from '@repo/ui/components/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@repo/ui/components/form'
import { Input } from '@repo/ui/components/input'
import { z } from 'zod'
import { passwordSchema } from '@repo/shared/schemas/auth/password'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

const emailLoginSchema = z.object({
  email: z.string().email().or(z.literal('')),
  password: passwordSchema.or(z.literal('')),
})

export type EmailLoginFormData = z.infer<typeof emailLoginSchema>

export function EmailLoginForm({
  onSubmit,
}: { onSubmit: (data: EmailLoginFormData) => void }) {
  const form = useForm<EmailLoginFormData>({
    resolver: zodResolver<typeof emailLoginSchema>(emailLoginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
    mode: 'onBlur',
  })

  const eitherIsEmpty = (data: EmailLoginFormData) => {
    return Object.values(data).some((value) => value === '')
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="grid gap-6">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel htmlFor="email">Email</FormLabel>
                <FormControl>
                  <Input
                    autoFocus={false}
                    id="email"
                    type="email"
                    placeholder="m@example.com"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel htmlFor="password">Password</FormLabel>
                <FormControl>
                  <Input
                    autoFocus={false}
                    id="password"
                    type="password"
                    required
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button
            type="submit"
            className="w-full"
            disabled={
              form.formState.isSubmitting ||
              !form.formState.isValid ||
              eitherIsEmpty(form.getValues())
            }
          >
            Login
          </Button>
        </div>
      </form>
    </Form>
  )
}
