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
import { useRouter } from "next/navigation";
import { Card } from "@repo/ui/components/card";
import Link from "next/link";
import { toast } from "sonner";
import { Badge } from "@repo/ui/components/badge";
import Logo from "@repo/ui/blocks/brand/logo";
import { signUp, useSession } from "@/lib/auth/client";
import { useEffect } from "react";

const signupSchema = z.object({
  name: z.string().min(1, "Please enter your name"),
  email: z
    .string({ required_error: "Please enter your email" })
    .email("Please enter a valid email address"),
  password: z
    .string({ required_error: "Please enter your password" })
    .min(8, "Password must be at least 8 characters"),
});

export default function SignupPage() {
  const router = useRouter();
  const { data: session } = useSession();
  
  const form = useForm<z.infer<typeof signupSchema>>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  useEffect(() => {
    if (session?.user) {
      router.push("/");
    }
  }, [session, router]);

  async function onSubmit(data: z.infer<typeof signupSchema>) {
    const { error } = await signUp.email({
      email: data.email,
      password: data.password,
      name: data.name,
    });

    if (error) {
      toast.error(error.message);
      return;
    }

    toast.success("Account created successfully! Please check your email to verify.");
    setTimeout(() => {
      router.push("/login?validating=true");
    }, 1000);
  }

  return (
    <div className="grid h-screen w-full place-items-center">
      <div className="flex w-full flex-col items-center p-2 sm:p-0">
        <Card className="max-w-[24rem] space-y-8 px-9 pt-6 pb-12 shadow-none sm:shadow-md">
          <div className="flex w-full items-center justify-between py-2">
            <div className="flex items-center gap-3">
              <h1 className="p-0 font-extrabold text-2xl">Sign Up</h1>
              <Badge variant="secondary" className="mt-1">
                Beta
              </Badge>
            </div>
            <Logo className="h-8" size={32} />
          </div>
          <Form {...form}>
            <form
              id="signupForm"
              className="space-y-4"
              onSubmit={form.handleSubmit(onSubmit)}
            >
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem className="space-y-1">
                    <FormLabel className="text-muted-foreground">Name</FormLabel>
                    <FormControl>
                      <Input className="h-9" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem className="space-y-1">
                    <FormLabel className="text-muted-foreground">Email</FormLabel>
                    <FormControl>
                      <Input type="email" className="h-9" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem className="space-y-1">
                    <FormLabel className="text-muted-foreground">
                      Password
                    </FormLabel>
                    <FormControl>
                      <Input type="password" className="h-9" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="w-full space-y-3 pt-5">
                <p className="text-center text-xs text-muted-foreground">
                  By signing up for the Numos Studio Beta you agree to the usage
                  of cookies for product improvements.
                </p>
                <Button type="submit" form="signupForm" className="h-9 w-full">
                  Sign Up
                </Button>
              </div>
            </form>
          </Form>
        </Card>
        <div className="flex w-full justify-center gap-1.5 py-3 text-[0.8rem] text-muted-foreground">
          <p>Already have an account?</p>
          <Link href="/login" className="underline">
            Login
          </Link>
        </div>
      </div>
    </div>
  );
}
