import Segment from '@/components/layouts/segmented/segment'
import SegmentedLayout from '@/components/layouts/segmented/segmented-layout'
import {
  Header,
  HeaderTitle,
  HeaderContent,
  HeaderMain,
} from '@/components/page/header'
import Main from '@/components/page/main'
import { Page } from '@/components/page/page'
import { ProfileNameInput } from '@/app/account/(components)/inputs/profile-name-input'
import { Label } from '@repo/ui/components/ui/label'
import { ProfileImageInput } from '@/app/account/(components)/inputs/profile-image-input'
import { UserConnections } from '@/app/account/(components)/inputs/user-connections'

export default async function UserProfilePage() {
  return (
    <Page>
      <Header>
        <HeaderContent>
          <HeaderMain>
            <HeaderTitle>Account</HeaderTitle>
          </HeaderMain>
        </HeaderContent>
      </Header>
      <Main>
        <SegmentedLayout>
          <Segment title="Profile" className="flex-row gap-8">
            <div className="w-20 shrink-0">
              <ProfileImageInput />
            </div>
            <div className="flex w-full flex-col justify-end gap-1.5">
              <Label className="pl-0.5" htmlFor="full-name">
                Name
              </Label>
              <ProfileNameInput id="full-name" />
            </div>
          </Segment>
          <Segment
            title="Connections"
            info={{
              description:
                'Manage the different ways you can log into your account with',
            }}
          >
            <UserConnections />
          </Segment>
        </SegmentedLayout>
      </Main>
    </Page>
  )
}
