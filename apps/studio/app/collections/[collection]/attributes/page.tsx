import Header from '@/components/layout/pages/header'
import Main from '@/components/layout/pages/main'
import { getAllAttributes } from '@/lib/supabase/db/attributes'
import {
  getCollectionFromSlug,
  getVersionIdFromCollectionSlug,
} from '@/lib/supabase/db/collections'
import {
  DataTable,
  type DataTableOptions,
} from '@repo/ui/components/ui/data-table'
import {
  type ExtendedAttribute,
  columns,
} from '@/app/collections/[collection]/attributes/(components)/attribute-columns'
import { Tabs } from '@repo/ui/components/ui/tabs'
import {
  PiAddAddStroke,
  PiGridDashboard02Stroke,
  PiGridTableStroke,
} from '@repo/ui/icons/pika'
import AttributeGrid from '@/app/collections/[collection]/attributes/(components)/attribute-grid'
import { Button } from '@repo/ui/components/ui/button'
import { NewAttributeDialog } from '@/app/collections/[collection]/attributes/(components)/new-attribute-dialog'

export default async function AttributesPage(props: {
  params: Promise<{ collection: string; attribute: string }>
}) {
  const { collection, attribute } = await props.params
  const version = await getVersionIdFromCollectionSlug(collection)
  const attributes = await getAllAttributes(version)

  const attributeRows: ExtendedAttribute[] = attributes.map((attribute) => ({
    ...attribute,
    collection_slug: collection,
  }))

  const tableOptions: DataTableOptions = {
    visibility: {
      slug: false,
      collection_slug: false,
    },
  }
  return (
    <Tabs defaultValue="grid">
      <Header
        title="Attributes"
        subtitle="Define the traits tokens in the collection can have."
        tabs={[
          {
            value: 'grid',
            label: 'Grid',
            Icon: PiGridDashboard02Stroke,
          },
          {
            value: 'table',
            label: 'Table',
            Icon: PiGridTableStroke,
          },
        ]}
      >
        <NewAttributeDialog
          button={
            <Button className="gap-1.5 pl-3">
              <PiAddAddStroke className="size-4" />
              New Attribute
            </Button>
          }
          versionId={version}
          collectionSlug={collection}
        />
      </Header>
      <Main tabValue="grid">
        <AttributeGrid
          attributes={attributeRows}
          collectionSlug={collection}
          versionId={version}
        />
      </Main>
      <Main className="p-0" tabValue="table">
        <DataTable
          columns={columns}
          data={attributeRows}
          options={tableOptions}
        />
      </Main>
    </Tabs>
  )
}
