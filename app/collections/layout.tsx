import { UserProvider } from "@/app/(providers)/user-context";
import type { ReactNode } from "react";
import { auth, type User } from "@/lib/auth";
import { headers } from "next/headers";

async function ensureUser(requestHeaders: Headers): Promise<User> {
  const session = await auth.api.getSession({
    headers: requestHeaders,
  });

  if (session?.user) {
    return session.user;
  }

  const anonymous = await auth.api.signInAnonymous({
    headers: requestHeaders,
  });

  if (!anonymous?.user?.id) {
    throw new Error("Failed to create anonymous session");
  }

  const newSession = await auth.api.getSession({
    headers: requestHeaders,
  });

  if (!newSession?.user) {
    throw new Error("Failed to get session");
  }

  return newSession.user;
}

export default async function CollectionsLayout({
  children,
}: {
  children: ReactNode;
}) {
  const user = await ensureUser(await headers());

  return <UserProvider user={user}>{children}</UserProvider>;
}
