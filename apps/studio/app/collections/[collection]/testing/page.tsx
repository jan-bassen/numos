import { getExtendedCollectionFromSlug } from '@/lib/supabase/db/collections'
import {
  Header,
  HeaderActions,
  HeaderContent,
  HeaderMain,
  HeaderTabBar,
  HeaderTabBarItem,
  HeaderTitle,
} from '@/components/page/header'
import Main from '@/components/page/main'
import { PiBugStroke, PiListCheckStroke } from '@repo/ui/icons/pika'
import { getActionIssues } from '@/lib/supabase/db/action-issues'
import IssuesButton from './(components)/issues-button'
import { Page } from '@/components/page/page'

export default async function MintSettingsPage(props: {
  params: Promise<{ collection: string }>
}) {
  const params = await props.params
  const collection = await getExtendedCollectionFromSlug(params.collection)
  const issues = await getActionIssues(collection.editable_version.id)

  return (
    <Page tabs tabsProps={{ defaultValue: 'issues' }}>
      <Header>
        <HeaderContent>
          <HeaderMain>
            <HeaderTitle>Testing</HeaderTitle>
          </HeaderMain>
          <HeaderActions>
            <IssuesButton
              version={collection.editable_version.id}
              hasIssues={issues.length > 0}
            />
          </HeaderActions>
        </HeaderContent>
        <HeaderTabBar>
          <HeaderTabBarItem value="issues" icon={PiListCheckStroke}>
            Issues
          </HeaderTabBarItem>
          <HeaderTabBarItem value="tests" icon={PiBugStroke}>
            Tests
          </HeaderTabBarItem>
        </HeaderTabBar>
      </Header>
      <Main value="issues">Hi</Main>
      <Main value="tests">Hi2</Main>
    </Page>
  )
}
