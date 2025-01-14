import type { TabOption } from '@/components/forms/tab-inputs/tab-option'
import { PiListDefaultStroke } from '@repo/ui/icons/pika'
import { PiSquareDotStroke } from '@repo/ui/icons/pika'

export const listOptionMap = {
  single: {
    value: false,
    label: 'Single',
    slug: 'single',
    subtext: 'Single value',
    Icon: PiSquareDotStroke,
  },
  list: {
    value: true,
    label: 'List',
    slug: 'list',
    subtext: 'Multiple values',
    Icon: PiListDefaultStroke,
  },
}

export const listOptions: TabOption<boolean>[] = Object.values(listOptionMap)
