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
import { PiPlaySquareSolid, PiAutomationSolid } from '@repo/ui/icons/pika'
import SegmentedLayout from '@/components/layouts/segmented/segmented-layout'
import Main from '@/components/page/main'
import { DeleteActionButton } from '@/app/collections/[collection]/actions/[action]/(components)/delete-action-button'
import { LockActionButton } from '@/app/collections/[collection]/actions/[action]/(components)/lock-action-button'
import { ActionTriggerTypeInput } from '@/app/collections/[collection]/actions/[action]/(components)/inputs/action-trigger-type-input'
import { triggerOptionsArray } from '@/lib/constants/triggers'

export default function ActionPage() {
  return (
    <Page tabs tabsProps={{ defaultValue: 'trigger' }}>
      <Header>
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
        </HeaderTabBar>
      </Header>
      <Main value="trigger">
        <SegmentedLayout>
          <Segment
            title="Trigger Type"
            description="Select how the action should be triggered."
            options={triggerOptionsArray.map((o) => ({
              label: o.label,
              explanation: o.description || '',
            }))}
          >
            <ActionTriggerTypeInput />
          </Segment>
        </SegmentedLayout>
      </Main>
      <Main value="action">Hi</Main>
    </Page>
  )
}
