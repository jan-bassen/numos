'use client'

import { TabToggle } from '@/components/forms/tab-inputs/tab-toggle'
import SegmentedLayout from '@/components/layouts/segmented/segmented-layout'
import Segment from '@/components/layouts/segmented/segment'
import {
  Header,
  HeaderContent,
  HeaderMain,
  HeaderTitle,
} from '@/components/page/header'
import Main from '@/components/page/main'
import type { JSX } from 'react'

export default function ImageSettingsEditor() {
  function PiCheckMarkCircleBrokenStroke(): JSX.Element {
    throw new Error('Function not implemented.')
  }

  return (
    <>
      <Header>
        <HeaderContent>
          <HeaderMain>
            <HeaderTitle>Image Settings</HeaderTitle>
          </HeaderMain>
        </HeaderContent>
      </Header>
      <Main>
        <SegmentedLayout>
          <Segment title="Test">
            <TabToggle
              options={[
                {
                  value: true,
                  label: 'Test',
                  Icon: PiCheckMarkCircleBrokenStroke,
                },
                {
                  value: false,
                  label: 'Test',
                  Icon: PiCheckMarkCircleBrokenStroke,
                },
              ]}
              value={true}
              onChange={() => {}}
            />
          </Segment>
        </SegmentedLayout>
      </Main>
    </>
  )
}
