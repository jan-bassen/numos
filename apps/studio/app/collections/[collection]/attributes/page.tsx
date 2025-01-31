import Main from '@/components/page/main'
import { getAllAttributes } from '@/lib/supabase/db/attributes/read'
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
import { PiAddAddStroke } from '@repo/ui/icons/pika'
import { Button } from '@repo/ui/components/ui/button'
import { NewAttributeDialog } from '@/app/collections/[collection]/attributes/(components)/new-attribute-dialog'
import {
  Header,
  HeaderActions,
  HeaderContent,
  HeaderMain,
  HeaderTitle,
} from '@/components/page/header'
import { Page } from '@/components/page/page'
import {
  ElementCardButton,
  ElementCardLink,
} from '@/components/elements/element-card'
import SimpleGrid from '@/components/layouts/simple/simple-grid'
import { dataTypes } from '@/lib/constants/datatypes'

export default async function AttributesPage(props: {
  params: Promise<{ collection: string; attribute: string }>
}) {
  const { collection: collectionSlug } = await props.params
  const collection = await getCollectionFromSlug(collectionSlug)
  if (!collection.editable_version) {
    throw new Error('Collection has no editable version')
  }
  const attributes = await getAllAttributes(collection.editable_version)

  /* const attributeRows: ExtendedAttribute[] = attributes.map((attribute) => ({
    ...attribute,
    collection_slug: collection,
  }))

  const tableOptions: DataTableOptions = {
    visibility: {
      slug: false,
      collection_slug: false,
    },
  } */

  return (
    <Page>
      <Header
        back={{
          href: `/collections/${collectionSlug}`,
          label: collection.name ?? 'Collection',
        }}
      >
        <HeaderContent>
          <HeaderMain>
            <HeaderTitle>Attributes</HeaderTitle>
          </HeaderMain>
          <HeaderActions>
            <NewAttributeDialog versionId={collection.editable_version}>
              <Button className="gap-1.5 pl-3">
                <PiAddAddStroke className="size-4" />
                New Attribute
              </Button>
            </NewAttributeDialog>
          </HeaderActions>
        </HeaderContent>
        {/* <HeaderTabBar>
          <HeaderTabBarItem value="grid" icon={PiGridDashboard02Stroke}>
            Grid
          </HeaderTabBarItem>
          <HeaderTabBarItem value="table" icon={PiGridTableStroke}>
            Table
          </HeaderTabBarItem>
        </HeaderTabBar> */}
      </Header>
      <Main>
        <SimpleGrid>
          {attributes.map((attribute) => {
            return (
              <ElementCardLink
                key={attribute.id}
                href={`/collections/${collectionSlug}/attributes/${attribute.slug}`}
                label={attribute.name ?? 'New Attribute'}
                subtitle={attribute.description}
                icon={dataTypes[attribute.value.type]?.icons.stroke}
              />
            )
          })}
          <NewAttributeDialog versionId={collection.editable_version}>
            <ElementCardButton size="md" variant="new" label="New Attribute" />
          </NewAttributeDialog>
        </SimpleGrid>
      </Main>
      {/* <Main className="p-0 md:p-0" value="table">
        <DataTable
          columns={columns}
          data={attributeRows}
          options={tableOptions}
        />
      </Main> */}
    </Page>
  )
}
