'use client'

import Segment from '@/components/layouts/segmented/segment'
import { deleteAttribute } from '@/lib/supabase/db/attributes'
import { handleReturnInfo } from '@repo/ui/lib/utils'
import { useRouter } from 'next/navigation'
import { attributeSchema } from '@/lib/schemas/attribute-schema'
import {
  Header,
  HeaderActions,
  HeaderContent,
  HeaderMain,
} from '@/components/page/header'
import Main from '@/components/page/main'
import SegmentedLayout from '@/components/layouts/segmented/segmented-layout'
import DeleteButton from '@/components/forms/buttons/delete-button'
import { Page } from '@/components/page/page'
import { useAttribute } from './context'
import { removeAttributeFromLocalForm } from '../(functions)/utils'
import { useCollection } from '../../context'
import { LockButton } from '@/components/forms/buttons/lock-button'
import { HeaderTitleInput } from '@/components/page/header-title-input'

export default function AttributePage() {
  const router = useRouter()
  const {
    attribute: { type, list, id, name, locked, slug, version },
    updateAttribute,
  } = useAttribute()
  const collection = useCollection()

  //TODO: Add schema validation
  const schema = attributeSchema(type, list)

  return (
    <Page>
      <Header>
        <HeaderContent>
          <HeaderMain>
            {/* <AttributeTitle /> */}
            <HeaderTitleInput
              value={name || 'Unnamed Attribute'}
              disabled={locked}
              onChange={(e) => updateAttribute('name', e.target.value)}
            />
          </HeaderMain>
          <HeaderActions>
            <DeleteButton
              title="attribute"
              onDelete={async () => {
                const res = await deleteAttribute(
                  id,
                  collection.slug,
                  version,
                  slug,
                )
                handleReturnInfo(res, () => {
                  removeAttributeFromLocalForm(collection.slug, slug)
                  router.push(`/collections/${collection.slug}/attributes`)
                })
              }}
            />
            <LockButton
              locked={locked}
              setLocked={(l) => updateAttribute('locked', l)}
            />
          </HeaderActions>
        </HeaderContent>
      </Header>
      <Main>
        <SegmentedLayout>
          <Segment
            title="Display"
            description="Only private attributes are secret and not added to the metadata. Shadowed attributes are still public, but not necessarily visible on frontends."
          >
            Hi
          </Segment>
        </SegmentedLayout>
      </Main>
    </Page>
  )
}
