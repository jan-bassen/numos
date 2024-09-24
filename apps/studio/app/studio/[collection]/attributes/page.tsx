import Header from '@/components/layout/pages/header'
import Main from '@/components/layout/pages/main'
import { getAllAttributes } from '@/lib/supabase/db/attributes'
import { getCollectionFromSlug } from '@/lib/supabase/db/collections'
import {
  DataTable,
  type DataTableOptions,
} from '@repo/ui/components/ui/data-table'
import {
  type ExtendedAttribute,
  columns,
} from '../../../../components/elements/attributes/attribute-columns'
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@repo/ui/components/ui/tabs'
import {
  PiAddAddStroke,
  PiGridDashboard02Stroke,
  PiGridTableStroke,
} from '@/lib/icons'
import AttributeGrid from '../../../../components/elements/attributes/attribute-grid'
import { Button } from '@repo/ui/components/ui/button'
import PageTopBar from '@/components/layout/pages/page-top-bar'
import Page from '@/components/layout/pages/page'
import SecondaryNavbar from '@/components/nav/secondary-navbar'
import type { NavItem } from '@/types/database.types'
import { dataTypes } from '@/lib/supabase/constants/datatypes'
import { iconClassesStroke } from '@/components/nav/navbar-links'
import { NewAttributeDialog } from '@/components/elements/attributes/new-attribute-dialog'

export default async function AttributesPage({
  params,
}: {
  params: { collection: string; attribute: string }
}) {
  const collection = await getCollectionFromSlug(params.collection)
  if (!collection.editable_version) throw new Error('No editable version')
  const attributes = await getAllAttributes(collection.editable_version)
  const attributeNavItems: NavItem[] = attributes.map((attribute) => ({
    name: `${attribute.name}${attribute.list ? ' (List)' : ''}`,
    slug: attribute.slug,
    icon: dataTypes[attribute.type].icons.stroke({
      className: iconClassesStroke,
    }),
  }))

  const attributeRows: ExtendedAttribute[] = attributes.map((attribute) => ({
    ...attribute,
    collection_slug: collection.slug,
  }))

  const tableOptions: DataTableOptions = {
    visibility: {
      slug: false,
      collection_slug: false,
    },
  }
  return (
    <Page>
      <SecondaryNavbar
        versionId={collection.editable_version}
        collectionSlug={params.collection}
        type="attributes"
        title="Attributes"
        items={attributeNavItems}
        NewItemDialog={NewAttributeDialog}
      />
      <Tabs defaultValue="grid" asChild>
        <Main>
          <Header
            title="Attributes"
            subtitle="Define the traits tokens in the collection can have."
          >
            <NewAttributeDialog
              button={
                <Button className="gap-1.5 pl-3">
                  <PiAddAddStroke className="size-4" />
                  New Attribute
                </Button>
              }
              versionId={collection.editable_version}
              collectionSlug={params.collection}
            />
          </Header>
          <div>
            <PageTopBar>
              <TabsList className="h-9 w-fit gap-1 bg-transparent p-0">
                <TabsTrigger
                  value="grid"
                  className="gap-1.5 rounded-md data-[state=active]:bg-muted"
                >
                  <PiGridDashboard02Stroke className="my-auto h-4 w-4" />
                  Grid
                </TabsTrigger>
                <TabsTrigger
                  value="table"
                  className="gap-1.5 rounded-md data-[state=active]:bg-muted"
                >
                  <PiGridTableStroke className="my-auto h-4 w-4" />
                  Table
                </TabsTrigger>
              </TabsList>
            </PageTopBar>
            <TabsContent value="grid" className="mt-3 w-full">
              <AttributeGrid
                attributes={attributeRows}
                collectionSlug={params.collection}
                versionId={collection.editable_version}
              />
            </TabsContent>
            <TabsContent value="table" className="mt-0 w-full">
              <DataTable
                columns={columns}
                data={attributeRows}
                options={tableOptions}
              />
            </TabsContent>
          </div>
        </Main>
      </Tabs>
    </Page>
  )
}
