import SecondaryNavbar, {
  seondaryNavbarIconClasses,
} from '@/components/nav/secondary-navbar'
import { getAttributesForNav } from '@/lib/supabase/db/attributes'
import { getCollectionFromSlug } from '@/lib/supabase/db/collections'
import type { NavItem } from '@/types/database.types'
import Page from '@/components/layout/pages/page'
import { dataTypes } from '@/lib/supabase/constants/datatypes'
import { NewAttributeDialog } from '@/components/elements/attributes/new-attribute-dialog'

export default async function Layout(
  props: {
    children: React.ReactNode
    params: Promise<{ collection: string; attribute: string }>
  }
) {
  const params = await props.params;

  const {
    children
  } = props;

  console.log('render')
  const collection = await getCollectionFromSlug(params.collection)
  if (!collection.editable_version) throw new Error('No editable version')
  const attributes = await getAttributesForNav(collection.editable_version)
  const attributeNavItems: NavItem[] = attributes.map((attribute) => ({
    name: `${attribute.name}${attribute.list ? ' (List)' : ''}`,
    slug: attribute.slug,
    icon: dataTypes[attribute.type].icons.stroke({
      className: seondaryNavbarIconClasses,
    }),
  }))
  return (
    <Page>
      <SecondaryNavbar
        versionId={collection.editable_version}
        collectionSlug={params.collection}
        type="attributes"
        current={params.attribute}
        title="Attributes"
        items={attributeNavItems}
        NewItemDialog={NewAttributeDialog}
      />
      {children}
    </Page>
  )
}
