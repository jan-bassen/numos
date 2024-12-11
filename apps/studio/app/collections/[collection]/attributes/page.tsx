import Main from '@/components/page/main'
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
import {
  Header,
  HeaderActions,
  HeaderContent,
  HeaderMain,
  HeaderTitle,
  HeaderTabBar,
  HeaderTabBarItem,
} from '@/components/page/header'
import { Page } from '@/components/page/page'

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
    <Page tabs tabsProps={{ defaultValue: 'grid' }}>
      <Header>
        <HeaderContent>
          <HeaderMain>
            <HeaderTitle>Attributes</HeaderTitle>
          </HeaderMain>
          <HeaderActions>
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
          </HeaderActions>
        </HeaderContent>
        <HeaderTabBar>
          <HeaderTabBarItem value="grid" icon={PiGridDashboard02Stroke}>
            Grid
          </HeaderTabBarItem>
          <HeaderTabBarItem value="table" icon={PiGridTableStroke}>
            Table
          </HeaderTabBarItem>
        </HeaderTabBar>
      </Header>
      <Main value="grid">
        <AttributeGrid
          attributes={attributeRows}
          collectionSlug={collection}
          versionId={version}
        />
      </Main>
      <Main className="p-0" value="table">
        <DataTable
          columns={columns}
          data={attributeRows}
          options={tableOptions}
        />
      </Main>
    </Page>
  )
}
