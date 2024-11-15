'use client'

import { TabToggle } from '@/components/forms/tab-inputs/tab-toggle'
import SegmentedLayout from '@/components/layouts/segmented/segmented-layout'
import Segment from '@/components/layouts/segmented/segment'
import Header from '@/components/page/header'
import Main from '@/components/page/main'
import type { SVGProps } from 'react'

export default function ImageSettingsEditor() {
  function PiCheckMarkCircleBrokenStroke(
    props: SVGProps<SVGSVGElement>,
  ): JSX.Element {
    throw new Error('Function not implemented.')
  }

  return (
    <>
      <Header
        title="Image Settings"
        subtitle="Configure the settings for the images in this collection"
      />
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
