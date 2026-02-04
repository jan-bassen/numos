"use client";

import type { Layer } from "@/lib/db/schema";
import { LayerCard } from "@/app/collections/[collection]/image/(components)/layer-view/layer-card";
import ListInput, {
  type ListItem,
} from "@/components/datatypes/list/list-input";
import {
  type LayerOrderChange,
  updateLayerOrder,
} from "@/lib/db/queries/layers";
import { toast } from "sonner";
import { useEffect, useState } from "react";

const updateOrder = async (changedIndices: LayerOrderChange) => {
  const res = await updateLayerOrder(changedIndices);
  if (!res.ok) {
    toast.error(res.message);
  }
};

export function LayerView({
  layers,
  collectionSlug,
}: { layers: Layer[]; collectionSlug: string }) {
  const [_layers, setLayers] = useState<ListItem<Layer>[]>(
    layers.map((layer) => ({ id: layer.id, value: layer }))
  );

  const indexMap: { [key: string]: number } = layers.reduce(
    (acc, layer, index) => {
      acc[layer.id] = index;
      return acc;
    },
    {} as { [key: string]: number }
  );

  useEffect(() => {
    const changedIndices: LayerOrderChange = [];
    _layers.map((item, index) => {
      const oldIndex = indexMap[item.id];
      if (oldIndex !== undefined && oldIndex !== index && item.value) {
        changedIndices.push({ id: item.value.id, index });
      }
    });
    if (changedIndices.length > 0) {
      updateOrder(changedIndices);
    }
  }, [_layers, indexMap]);

  return (
    <ListInput<Layer>
      value={_layers}
      onChange={setLayers}
      classNames={{
        container: "max-w-full",
        button: "hidden",
      }}
      addButtonLabel="New Layer"
      input={(props) => (
        <LayerCard {...props} collectionSlug={collectionSlug} />
      )}
    />
  );
}
