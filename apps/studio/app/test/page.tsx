import { Navbar } from '@/components/navigation/navbar/navbar'
import Header from '@/components/page/header'
import Main from '@/components/page/main'
import Page from '@/components/page/page'
import { AbiButton } from '@/lib/blockchain/abi-button'
import WalletButton from '@/lib/blockchain/wallet'
import { Button } from '@repo/ui/components/ui/button'

export default function TestPage() {
  return (
    <>
      <Navbar />
      <Page>
        <Header title="Test" />
        <Main>
          <WalletButton />
          <AbiButton />
        </Main>
      </Page>
    </>
  )
}
