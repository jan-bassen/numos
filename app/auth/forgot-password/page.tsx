"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@repo/ui/components/form";
import { Input } from "@repo/ui/components/input";
import { Button, buttonVariants } from "@repo/ui/components/button";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Card } from "@repo/ui/components/card";
import Link from "next/link";
import { cn } from "@repo/ui/lib/utils";
import Logo from "@repo/ui/blocks/brand/logo";
import { authClient } from "@/lib/auth/client";

const formSchema = z.object({
  email: z
    .string({ error: "Please enter your email" })
    .email({ error: "Please enter a valid email address" }),
});

export default function ForgotPasswordPage() {
  const router = useRouter();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  });

  async function onSubmit(data: z.infer<typeof formSchema>) {
    const { error } = await authClient.requestPasswordReset({
      email: data.email,
      redirectTo: "/auth/reset-password",
    });

    if (error) {
      toast.error(error.message);
      return;
    }

    toast.success("Check your email for a reset link");
    router.push("/auth/reset-password");
  }

  return (
    <div className="grid h-screen w-full place-items-center">
      <div className="flex w-full flex-col items-center p-2 sm:p-0">
        <Card className="w-full max-w-[24rem] space-y-8 px-9 pt-6 pb-12 shadow-none sm:shadow-md">
          <div className="flex w-full items-center justify-between gap-2 py-2">
            <h1 className="p-0 font-extrabold font-heading text-2xl">
              Forgot Password
            </h1>
            <Logo className="h-8" size={32} />
          </div>
          <Form {...form}>
            <form
              id="forgotPasswordForm"
              className="space-y-5"
              onSubmit={form.handleSubmit(onSubmit)}
            >
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem className="space-y-1">
                    <FormLabel className="text-muted-foreground">
                      Email:
                    </FormLabel>
                    <FormControl>
                      <Input type="email" className="h-9" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="w-full pt-8">
                <Button
                  type="submit"
                  form="forgotPasswordForm"
                  className="h-9 w-full"
                >
                  Send Reset Link
                </Button>
              </div>
            </form>
          </Form>
        </Card>
        <div className="flex w-full justify-center gap-1.5 py-3 text-[0.8rem] text-muted-foreground">
          <p>Remember your password?</p>
          <Link href="/login" className="underline">
            Login
          </Link>
        </div>
      </div>
    </div>
  );
}
