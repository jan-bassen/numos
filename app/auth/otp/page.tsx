"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Card } from "@repo/ui/components/card";
import Logo from "@repo/ui/blocks/brand/logo";
import { Suspense } from "react";

function OTPContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email");

  // Better Auth handles OTP differently - redirect to appropriate flow
  if (!email) {
    router.push("/login");
    return null;
  }

  return (
    <Card className="w-full max-w-[24rem] space-y-8 px-9 pt-6 pb-12 shadow-none sm:shadow-md">
      <div className="flex w-full items-center justify-between gap-2 py-2">
        <h1 className="p-0 font-extrabold font-heading text-2xl">
          Check Your Email
        </h1>
        <Logo className="h-8" size={32} />
      </div>
      <p className="text-center text-sm text-muted-foreground">
        We&apos;ve sent a verification link to <strong>{email}</strong>. Please
        check your inbox and click the link to continue.
      </p>
    </Card>
  );
}

export default function OTPPage() {
  return (
    <div className="grid h-screen w-full place-items-center">
      <div className="flex w-full flex-col items-center p-2 sm:p-0">
        <Suspense fallback={<div>Loading...</div>}>
          <OTPContent />
        </Suspense>
      </div>
    </div>
  );
}
