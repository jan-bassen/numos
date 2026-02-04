import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@repo/ui/components/sidebar";
import { Support } from "./support";
import type { ActionNavItem } from "@/lib/db/queries/actions";
import { NavUser } from "@/components/navigation/navbar/user/nav-user";
import { Suspense } from "react";
import { CollectionParts } from "@/components/navigation/navbar/collection/collection-parts/collection-parts";
import { NumosButton } from "@/components/navigation/navbar/numos-button";
import { Collections } from "@/components/navigation/navbar/collections/collections";
import { CollectionsSkeleton } from "@/components/navigation/navbar/collections/collections-skeleton";
import { CollectionSettings } from "@/components/navigation/navbar/collection/collection-general";
import { CollectionPartsSkeleton } from "@/components/navigation/navbar/collection/collection-parts/collection-parts-skeleton";
import type { AttributeNavItem } from "@/lib/db/queries/attributes";
import { CollectionSwitcher } from "@/components/navigation/navbar/collection/collection-switcher/collection-switcher";
import { CollectionSwitcherSkeleton } from "@/components/navigation/navbar/collection/collection-switcher/collection-switcher-skeleton";
import type { LayerNavItem } from "@/lib/db/queries/layers";

type SidebarProps = React.ComponentProps<typeof Sidebar> & {
  collection?: string;
};

export type NavItems = [AttributeNavItem[], ActionNavItem[], LayerNavItem[]];

export async function Navbar({ collection, ...props }: SidebarProps) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <NumosButton />
      </SidebarHeader>
      <SidebarContent className="scrollbar-thin scrollbar-thumb-sidebar-border scrollbar-track-transparent">
        {collection ? (
          <>
            <div className="px-2 pt-3">
              <Suspense fallback={<CollectionSwitcherSkeleton />}>
                <CollectionSwitcher collection_slug={collection} />
              </Suspense>
            </div>
            <Suspense
              fallback={
                <CollectionPartsSkeleton collection_slug={collection} />
              }
            >
              <CollectionParts collection_slug={collection} />
            </Suspense>
            <CollectionSettings collection_slug={collection} />
          </>
        ) : (
          <Suspense fallback={<CollectionsSkeleton />}>
            <Collections />
          </Suspense>
        )}
        <Support className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
