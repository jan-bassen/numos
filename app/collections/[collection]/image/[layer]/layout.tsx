import { notFound } from "next/navigation";
import { getLayerBySlugs } from "@/lib/db/queries/layers";
import { LayerProvider } from "./context";

export default async function ImageLayerLayout(props: {
  params: Promise<{ collection: string; layer: string }>;
  children: React.ReactNode;
}) {
  const { collection, layer: layerSlug } = await props.params;

  const layer = await getLayerBySlugs(collection, layerSlug);
  if (!layer) {
    notFound();
  }

  return <LayerProvider layer={layer}>{props.children}</LayerProvider>;
}
