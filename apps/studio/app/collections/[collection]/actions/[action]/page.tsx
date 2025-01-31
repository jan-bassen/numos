import { HeaderTabBarItem } from '@/components/page/header'
import Segment from '@/components/layouts/segmented/segment'
import {
  Header,
  HeaderActions,
  HeaderContent,
  HeaderMain,
  HeaderTabBar,
} from '@/components/page/header'
import { Page } from '@/components/page/page'
import { ActionTitle } from '@/app/collections/[collection]/actions/[action]/(components)/action-title'
import {
  PiPlaySquareSolid,
  PiAutomationSolid,
  PiSettings02Solid,
} from '@repo/ui/icons/pika'
import SegmentedLayout from '@/components/layouts/segmented/segmented-layout'
import Main from '@/components/page/main'
import { DeleteActionButton } from '@/app/collections/[collection]/actions/[action]/(components)/delete-action-button'
import { LockActionButton } from '@/app/collections/[collection]/actions/[action]/(components)/lock-action-button'
import { ActionTriggerTypeInput } from '@/app/collections/[collection]/actions/[action]/(components)/inputs/action-trigger-type-input'
import { triggerOptionsArray } from '@/lib/constants/triggers'
import { ComingSoonBadge } from '@/components/misc/coming-soon-badge'
import { ActionLogicButton } from '@/app/collections/[collection]/actions/[action]/(components)/logic-button'
import {
  Select,
  SelectItem,
  SelectContent,
  SelectTrigger,
  SelectValue,
} from '@repo/ui/components/ui/select'
import { TriggerSettingsSegment } from '@/app/collections/[collection]/actions/[action]/(components)/inputs/trigger-settings/trigger-settings-segment'
import { ActionSlugInput } from '@/app/collections/[collection]/actions/[action]/(components)/inputs/action-slug-input'
import { ActionDescriptionInput } from '@/app/collections/[collection]/actions/[action]/(components)/inputs/action-description-input'

export default async function ActionPage({params}: {params: Promise<{collection: string, action: string}>}) {
  const {collection} = await params
  return (
    <Page tabs tabsProps={{ defaultValue: 'trigger', pageid: 'action' }}>
      <Header back={{ href: `/collections/${collection}/actions`, label: 'All Actions' }}>
        <HeaderContent>
          <HeaderMain>
            <ActionTitle />
          </HeaderMain>
          <HeaderActions>
            <DeleteActionButton />
            <LockActionButton />
          </HeaderActions>
        </HeaderContent>
        <HeaderTabBar>
          <HeaderTabBarItem value="trigger" icon={PiPlaySquareSolid}>
            Trigger
          </HeaderTabBarItem>
          <HeaderTabBarItem value="action" icon={PiAutomationSolid}>
            Action
          </HeaderTabBarItem>
          <HeaderTabBarItem value="settings" icon={PiSettings02Solid}>
            Settings
          </HeaderTabBarItem>
        </HeaderTabBar>
      </Header>
      <Main value="trigger">
        <SegmentedLayout>
          <Segment
            title="Trigger Type"
            info={{
              description: 'Select how the action should be triggered.',
              options: triggerOptionsArray.map((o) => ({
                label: o.label,
                explanation: o.description || '',
              })),
            }}
          >
            <ActionTriggerTypeInput />
          </Segment>
          <TriggerSettingsSegment />
        </SegmentedLayout>
      </Main>
      <Main value="action">
        <SegmentedLayout>
          <Segment title="Action Type">
            <Select value="custom">
              <SelectTrigger disabled>
                <SelectValue>Custom Logic</SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="custom">Custom Logic</SelectItem>
              </SelectContent>
            </Select>
            <ComingSoonBadge
              title="More types coming soon!"
              description="We are working hard to bring you more types of actions. Stay tuned for updates!"
            />
          </Segment>
          <Segment
            title="Execution Logic"
            info={{
              description: 'Define what the action does when triggered.',
            }}
          >
            <ActionLogicButton />
          </Segment>
        </SegmentedLayout>
      </Main>
      <Main value="settings">
        <SegmentedLayout>
          <Segment
            title="Identifier"
            info={{
              description:
                'The identifier is a unique name of the action within your collection.',
            }}
          >
            <ActionSlugInput />
          </Segment>
          <Segment
            title="Description"
            info={{
              description: 'Describe your action in a few sentences.',
            }}
          >
            <ActionDescriptionInput />
          </Segment>
        </SegmentedLayout>
      </Main>
    </Page>
  )
}
