import {
  Header,
  HeaderActions,
  HeaderContent,
  HeaderMain,
  HeaderTabBar,
  HeaderTabBarItem,
  HeaderTitle,
} from "@/components/page/header";
import {
  PiAddAddStroke,
  PiLayerThreeSolid,
  PiSettings02Solid,
} from "@repo/ui/icons/pika";
import Main from "@/components/page/main";
import { Page } from "@/components/page/page";
import { ComingSoonBadge } from "@/components/misc/coming-soon-badge";
import { getAllLayers } from "@/lib/db/queries/layers";
import { getExtendedCollectionFromSlug } from "@/lib/db/queries/collections";
import { LayerView } from "@/app/collections/[collection]/image/(components)/layer-view/layer-view";
import { NewLayerDialog } from "@/app/collections/[collection]/image/(components)/new-layer/new-layer-dialog";
import { Button } from "@repo/ui/components/button";

export default async function Collection(props: {
  params: Promise<{ collection: string }>;
}) {
  const { collection: collectionSlug } = await props.params;
  const collection = await getExtendedCollectionFromSlug(collectionSlug);
  const layers = await getAllLayers(collection.editableVersion.id);
  return (
    <Page tabs tabsProps={{ pageid: "image", defaultValue: "layers" }}>
      <Header
        back={{
          href: `/collections/${collectionSlug}`,
          label: collection.name ?? "Collection",
        }}
      >
        <HeaderContent>
          <HeaderMain>
            <HeaderTitle>Image Layers</HeaderTitle>
          </HeaderMain>
          <HeaderActions>
            <NewLayerDialog versionId={collection.editableVersion.id}>
              <Button className="gap-1.5 pl-3">
                <PiAddAddStroke className="size-4" />
                New Layer
              </Button>
            </NewLayerDialog>
          </HeaderActions>
        </HeaderContent>
        <HeaderTabBar>
          <HeaderTabBarItem value="layers" icon={PiLayerThreeSolid}>
            Layers
          </HeaderTabBarItem>
          <HeaderTabBarItem value="tests" icon={PiSettings02Solid}>
            Settings
          </HeaderTabBarItem>
        </HeaderTabBar>
      </Header>
      <Main value="layers">
        <LayerView layers={layers} collectionSlug={collectionSlug} />
      </Main>
      <Main value="tests">
        <ComingSoonBadge />
      </Main>
    </Page>
  );
}
