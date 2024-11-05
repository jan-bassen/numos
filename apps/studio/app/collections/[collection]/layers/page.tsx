import Main from '@/components/layout/pages/main'
import Page from '@/components/layout/pages/page'
import { getCollectionFromSlug } from '@/lib/supabase/db/collections'
import LayerTreeView from '../../../../components/elements/layers/tree'
import { getLayerTree } from '@/lib/supabase/db/layers'

export default async function LayerPage(
  props: {
    params: Promise<{ collection: string }>
  }
) {
  const params = await props.params;
  const collection = await getCollectionFromSlug(params.collection)
  const tree = await getLayerTree(collection.id)
  return (
    <Page>
      <Main>
        <LayerTreeView collection={collection} tree={tree} />
      </Main>
    </Page>
  )
}
