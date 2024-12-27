import Segment from '@/components/layouts/segmented/segment'
import {
  Header,
  HeaderActions,
  HeaderContent,
  HeaderMain,
  HeaderTabBar,
  HeaderTabBarItem,
} from '@/components/page/header'
import Main from '@/components/page/main'
import SegmentedLayout from '@/components/layouts/segmented/segmented-layout'
import { Page } from '@/components/page/page'
import { PiInputFieldSolid, PiSettings02Solid } from '@repo/ui/icons/pika'
import { AttributeTitle } from '@/app/collections/[collection]/attributes/[attribute]/(components)/attribute-title'
import { DeleteAttributeButton } from '@/app/collections/[collection]/attributes/[attribute]/(components)/delete-attribute-button'
import { LockAttributeButton } from '@/app/collections/[collection]/attributes/[attribute]/(components)/lock-attribute-button'
import { AttributeDescriptionInput } from '@/app/collections/[collection]/attributes/[attribute]/(components)/inputs/attribute-description-input'
import { AttributeDefaultValueInput } from '@/app/collections/[collection]/attributes/[attribute]/(components)/inputs/attribute-default-value-input'
import { AttributeListInput } from '@/app/collections/[collection]/attributes/[attribute]/(components)/inputs/attribute-list-input'
import { AttributeTypeInput } from '@/app/collections/[collection]/attributes/[attribute]/(components)/inputs/attribute-type-input'
import { attributeTypeOptions } from '@/lib/constants/datatypes'
import { AttributeOptionsInput } from '@/app/collections/[collection]/attributes/[attribute]/(components)/inputs/attribute-options-input'
import { AttributeSlugInput } from '@/app/collections/[collection]/attributes/[attribute]/(components)/inputs/attribute-slug-input'
import { AttributeDisplayInput } from '@/app/collections/[collection]/attributes/[attribute]/(components)/inputs/attribute-display-input'

export default function AttributePage() {
  return (
    <Page tabs tabsProps={{ pageid: 'attribute', defaultValue: 'value' }}>
      <Header>
        <HeaderContent>
          <HeaderMain>
            <AttributeTitle />
          </HeaderMain>
          <HeaderActions>
            <DeleteAttributeButton />
            <LockAttributeButton />
          </HeaderActions>
        </HeaderContent>
        <HeaderTabBar>
          <HeaderTabBarItem value="value" icon={PiInputFieldSolid}>
            Value
          </HeaderTabBarItem>
          <HeaderTabBarItem value="settings" icon={PiSettings02Solid}>
            Settings
          </HeaderTabBarItem>
        </HeaderTabBar>
      </Header>
      <Main value="value">
        <SegmentedLayout>
          <Segment
            title="List"
            description="If the attribute is a list, it can hold a multiple values as a list."
            options={[
              {
                label: 'Single',
                explanation: 'Value1',
              },
              {
                label: 'List',
                explanation: '[ Value1, Value2, Value3 ]',
              },
            ]}
          >
            <AttributeListInput />
          </Segment>
          <Segment
            title="Datatype"
            description="Select the datatype of the attribute"
            options={attributeTypeOptions.map((option) => ({
              label: option.label,
              explanation: option.subtext || '',
            }))}
          >
            <AttributeTypeInput />
          </Segment>
          <AttributeOptionsInput />
          <Segment
            title="Default Value"
            description="At mint, every token needs to have a value for each attribute. If you don't set a default value here, the attribute will need to be set in an action that triggers on mint."
          >
            <AttributeDefaultValueInput />
          </Segment>
        </SegmentedLayout>
      </Main>
      <Main value="settings">
        <SegmentedLayout>
          <Segment
            title="Display"
            description="Only private attributes are secret and not added to the metadata. Shadowed attributes are still public, but not necessarily visible on frontends."
          >
            <AttributeDisplayInput />
          </Segment>
          <Segment
            title="Identifier"
            description="This will identify your collection in and outside the studio."
          >
            <AttributeSlugInput />
          </Segment>
          <Segment
            title="Description"
            description="A description will help you and others remember what your attribute is about."
          >
            <AttributeDescriptionInput />
          </Segment>
        </SegmentedLayout>
      </Main>
    </Page>
  )
}
