import { getAttributeBySlug } from '@/lib/supabase/db/attributes'
import AttributeEditor from '../../../../../components/elements/attributes/attribute-editor'
import { getExtendedCollectionFromSlug } from '@/lib/supabase/db/collections'

export default async function Attribute(props: {
  params: Promise<{ collection: string; attribute: string }>
}) {
  const params = await props.params
  const collection = await getExtendedCollectionFromSlug(params.collection)
  const attribute = await getAttributeBySlug(
    collection.editable_version.id,
    params.attribute,
  )
  return (
    <AttributeEditor
      attribute={attribute}
      collectionSlug={params.collection}
      version={collection.editable_version}
    />
  )
}
