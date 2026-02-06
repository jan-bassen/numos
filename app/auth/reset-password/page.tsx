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
import { Button } from "@repo/ui/components/button";
import { toast } from "sonner";
import { useRouter, useSearchParams } from "next/navigation";
import { Card } from "@repo/ui/components/card";
import Logo from "@repo/ui/blocks/brand/logo";
import { authClient } from "@/lib/auth/client";
import { Suspense } from "react";

const formSchema = z
  .object({
    password: z
      .string({ error: "Please enter a password" })
      .min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string({ error: (issue) => issue.input === undefined ? "Please confirm your password" : "Please enter a valid password" }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  async function onSubmit(data: z.infer<typeof formSchema>) {
    if (!token) {
      toast.error("Invalid reset link");
      return;
    }

    const { error } = await authClient.resetPassword({
      newPassword: data.password,
      token,
    });

    if (error) {
      toast.error(error.message);
      return;
    }

    toast.success("Password reset successfully");
    router.push("/login");
  }

  return (
    <Card className="w-full max-w-[24rem] space-y-8 px-9 pt-6 pb-12 shadow-none sm:shadow-md">
      <div className="flex w-full items-center justify-between gap-2 py-2">
        <h1 className="p-0 font-extrabold font-heading text-2xl">
          Reset Password
        </h1>
        <Logo className="h-8" size={32} />
      </div>
      <Form {...form}>
        <form
          id="resetPasswordForm"
          className="space-y-5"
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem className="space-y-1">
                <FormLabel className="text-muted-foreground">
                  New Password:
                </FormLabel>
                <FormControl>
                  <Input type="password" className="h-9" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem className="space-y-1">
                <FormLabel className="text-muted-foreground">
                  Confirm Password:
                </FormLabel>
                <FormControl>
                  <Input type="password" className="h-9" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="w-full pt-8">
            <Button
              type="submit"
              form="resetPasswordForm"
              className="h-9 w-full"
            >
              Reset Password
            </Button>
          </div>
        </form>
      </Form>
    </Card>
  );
}

export default function ResetPasswordPage() {
  return (
    <div className="grid h-screen w-full place-items-center">
      <div className="flex w-full flex-col items-center p-2 sm:p-0">
        <Suspense fallback={<div>Loading...</div>}>
          <ResetPasswordForm />
        </Suspense>
      </div>
    </div>
  );
}
