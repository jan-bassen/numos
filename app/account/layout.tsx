import { Page } from "@/components/page/page";
import { Navbar } from "@/components/navigation/navbar/navbar";
import { redirect } from "next/navigation";
import { UserProvider } from "@/app/(providers)/user-context";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export default async function UserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    redirect("/");
  }

  // Redirect anonymous users away from account settings
  const isAnonymous = (session.user as { isAnonymous?: boolean }).isAnonymous;
  if (isAnonymous) {
    redirect("/collections");
  }


  return (
    <UserProvider user={session.user}>
        <Navbar />
        <Page>{children}</Page>
    </UserProvider>
  );
}
