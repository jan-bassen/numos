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
import { PiAlertTriangleStroke, PiCrossCross } from "@repo/ui/icons/pika";
import Link from "next/link";
import { cn } from "@repo/ui/lib/utils";
import { Suspense, use } from "react";
import posthog from "posthog-js";
import Logo from "@repo/ui/blocks/brand/logo";
import { signIn } from "@/lib/auth/client";

const formSchema = z.object({
  email: z
    .string({ error: "Please enter your email" })
    .email("Please enter a valid email address"),
  password: z
    .string({ error: "Please enter your password" })
    .min(6, "Please enter a password with at least 6 characters"),
});

export default function LoginPage(props: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const searchParams = use(props.searchParams);
  const router = useRouter();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const validating = searchParams.validating === "true";

  async function onSubmit(login: z.infer<typeof formSchema>) {
    const { data, error } = await signIn.email({
      email: login.email,
      password: login.password,
    });

    if (error) {
      toast.error(error.message);
      return;
    }

    localStorage.setItem("cookie_consent", "yes");
    if (!posthog.__loaded && data?.user) {
      posthog.identify(data.user.id, {
        email: data.user.email,
        name: data.user.name || null,
      });
    }
    router.push("/");
  }

  return (
    <div className="grid h-screen w-full place-items-center">
      <div
        className={cn(
          "flex w-full flex-col items-center p-2 sm:p-0",
          validating && "space-y-3"
        )}
      >
        <Card className="w-full max-w-[24rem] space-y-8 px-9 pt-6 pb-12 shadow-none sm:shadow-md">
          <div className="flex w-full items-center justify-between gap-2 py-2">
            <h1 className="p-0 font-extrabold font-heading text-2xl">Login</h1>
            <Logo className="h-8" size={32} />
          </div>
          <Form {...form}>
            <form
              id="loginForm"
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
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem className="space-y-1">
                    <div className="flex items-end justify-between">
                      <FormLabel className="pb-0.5 text-muted-foreground">
                        Password:
                      </FormLabel>
                      <Link
                        href="/auth/forgot-password"
                        className={cn(
                          buttonVariants({ variant: "ghost" }),
                          "h-5 translate-y-0.5 px-1.5 py-0 text-[11px] text-muted-foreground"
                        )}
                      >
                        Forgot password?
                      </Link>
                    </div>
                    <FormControl>
                      <Input type="password" className="h-9" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="w-full pt-8">
                <Button type="submit" form="loginForm" className="h-9 w-full">
                  Login
                </Button>
              </div>
            </form>
          </Form>
        </Card>
        <Suspense>
          {validating ? (
            <Card className="flex items-center gap-4 border-none bg-warning/10 py-3 pr-4 pl-5 text-sm shadow-none sm:border sm:shadow-md">
              <PiAlertTriangleStroke className="size-6" />
              We&apos;ve sent you an email. Please validate your email address
              before proceeding
              <Button
                onClick={() => router.push("/login")}
                variant={"ghost"}
                size={"icon"}
                className="hover:!border hover:!bg-background size-8 shrink-0 bg-transparent"
              >
                <PiCrossCross className="size-4" />
              </Button>
            </Card>
          ) : (
            <div className="flex w-full justify-center gap-1.5 py-3 text-[0.8rem] text-muted-foreground">
              <p>Don&apos;t have an account yet?</p>
              <Link href="/signup" className="underline">
                Sign Up
              </Link>
            </div>
          )}
        </Suspense>
      </div>
    </div>
  );
}
