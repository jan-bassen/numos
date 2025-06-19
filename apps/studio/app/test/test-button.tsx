'use client'

import { Button } from '@repo/ui/components/button'
import { updateAttributeSchema } from '@/lib/schemas/attributes/attribute-schema'

export function TestButton() {
  async function handleClick() {
    /* const attr = await getAttributeBySlugs('treuekarte', 'bool') */
    const testAttribute = {
      slug: 'test',
      name: 'test',
      type: 'enum',
      list: true,
      value: {
        type: 'enum',
        list: false,
        default: {
          value: 'test-value',
          format: 'single',
          type: 'enum',
        },
        options: [
          {
            value: 'test-value',
          },
        ],
      },
      settings: null,
    }
    try {
      const res = updateAttributeSchema.parse(testAttribute)
      console.log(res)
    } catch (e) {
      console.log(e)
    }
  }
  return <Button onClick={() => handleClick()}>Load Attribute</Button>
}
