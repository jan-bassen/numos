import { UserProvider } from "@/app/(providers)/user-context";
import { ProfileProvider } from "@/app/(providers)/profile-context";
import type { ReactNode } from "react";
import { getProfile } from "@/lib/db/queries/profiles";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export default async function CollectionsLayout({
  children,
}: {
  children: ReactNode;
}) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    redirect("/login");
  }

  const profile = await getProfile(session.user.id);

  // Create profile if it doesn't exist
  if (!profile) {
    const { createProfile } = await import("@/lib/db/queries/profiles");
    await createProfile({
      id: session.user.id,
      fullName: session.user.name,
      username: session.user.name,
    });
  }

  const userProfile = profile ?? {
    id: session.user.id,
    fullName: session.user.name,
    username: session.user.name,
    avatarUrl: session.user.image ?? null,
    updatedAt: null,
  };

  return (
    <UserProvider user={session.user}>
      <ProfileProvider profile={userProfile}>{children}</ProfileProvider>
    </UserProvider>
  );
}
