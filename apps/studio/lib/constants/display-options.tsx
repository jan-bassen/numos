import type { TabOption } from '@/components/forms/tab-inputs/tab-option'
import {
  PiEye02OffStroke,
  PiGlobeStroke,
  PiIncognitoStroke,
} from '@repo/ui/icons/pika'

export type AttributeDisplay = 'public' | 'hidden' | 'private'
export const attributeDisplayOptionMap: Record<AttributeDisplay, TabOption> = {
  public: {
    value: 'public',
    label: 'Public',
    subtext: 'Openly displayed',
    Icon: PiGlobeStroke,
  },
  private: {
    value: 'private',
    label: 'Private',
    subtext: 'Only known to you',
    Icon: PiIncognitoStroke,
  },
  hidden: {
    value: 'hidden',
    label: 'Shadowed',
    subtext: 'Public, not displayed',
    Icon: PiEye02OffStroke,
  },
}

export const attributeDisplayOptions: TabOption<AttributeDisplay>[] =
  Object.entries(attributeDisplayOptionMap).map(([key, value]) => ({
    value: key as AttributeDisplay,
    label: value.label,
    subtext: value.subtext,
    Icon: value.Icon,
  }))
