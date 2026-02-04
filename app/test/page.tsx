import { Navbar } from '@/components/navigation/navbar/navbar'
import {
  Header,
  HeaderActions,
  HeaderContent,
  HeaderMain,
  HeaderTitle,
} from '@/components/page/header'
import Main from '@/components/page/main'
import { Page } from '@/components/page/page'

export default function TestPage() {
  return (
    <>
      <Navbar />
      <Page tabs tabsProps={{ pageid: 'test', defaultValue: 'test' }}>
        <Header
          back={{
            href: '/collections',
            label: 'Collections',
          }}
        >
          <HeaderContent>
            <HeaderMain>
              <HeaderTitle>Test</HeaderTitle>
            </HeaderMain>
            <HeaderActions>{/* <TestButton /> */}</HeaderActions>
          </HeaderContent>
        </Header>
        <Main value="test">
          {/* <TestButton /> */}
          {/* <WalletButton />
          <AbiButton /> */}
        </Main>
      </Page>
    </>
  )
}
