import { getActionBySlugs } from "@/lib/db/queries/actions";
import { ActionProvider } from "@/app/collections/[collection]/actions/[action]/action-context";
import { notFound } from "next/navigation";

export default async function ActionLayout({
  params,
  children,
}: {
  params: Promise<{ collection: string; action: string }>;
  children: React.ReactNode;
}) {
  const { collection: collectionSlug, action: actionSlug } = await params;
  const action = await getActionBySlugs(collectionSlug, actionSlug);
  if (!action) {
    notFound();
  }
  return <ActionProvider action={action}>{children}</ActionProvider>;
}
