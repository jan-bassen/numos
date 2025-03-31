import {
  Form,
  FormItem,
  FormLabel,
  FormMessage,
} from '@repo/ui/components/form'
import { Input } from '@repo/ui/components/input'
import { useForm } from 'react-hook-form'
export function ExampleInput() {
  const form = useForm()
  return (
    <Form {...form}>
      <FormItem>
        <FormLabel htmlFor="email">Email</FormLabel>
        <Input type="email" id="email" placeholder="Email address" />
        <FormMessage />
      </FormItem>
    </Form>
  )
}
