"use client";

import { Button } from "@repo/ui/components/button";
import { PiEnvelopeDefaultStroke } from "@repo/ui/icons/pika";
import type { SVGProps, JSX } from "react";
import { useState } from "react";
import { cn } from "@repo/ui/lib/utils";
import { useUser } from "@/app/(providers)/user-context";
import PasswordDialogContent from "@/app/account/(components)/inputs/password-dialog";
import { Dialog } from "@repo/ui/components/dialog";

const providers: {
  [key: string]: {
    name: string;
    icon: (props: SVGProps<SVGSVGElement>) => JSX.Element;
  };
} = {
  email: {
    name: "Email",
    icon: PiEnvelopeDefaultStroke,
  },
};

export function UserConnections({ className }: { className?: string }) {
  const [passwordDialogOpen, setPasswordDialogOpen] = useState(false);
  const { user } = useUser();

  return (
    <Dialog open={passwordDialogOpen} onOpenChange={setPasswordDialogOpen}>
      <ul className={cn("flex flex-col gap-6 pt-2", className)}>
        <li className="flex items-center justify-between gap-2">
          <div className="flex max-sm:w-full max-sm:items-start items-center gap-4">
            <div className="flex items-center gap-2">
              <PiEnvelopeDefaultStroke className="size-4" />
              Email
            </div>
            <p className="h-fit rounded-xs bg-muted px-2 py-1 font-normal text-muted-foreground text-xs">
              {user.email}
            </p>
          </div>
          <Button
            type="button"
            variant={"secondary"}
            className="max-sm:hidden h-fit rounded-xs bg-muted px-2 py-1 font-normal text-xs"
            onClick={() => setPasswordDialogOpen(true)}
          >
            Change Password
          </Button>
        </li>
      </ul>
      <PasswordDialogContent setDialogOpen={setPasswordDialogOpen} />
    </Dialog>
  );
}
