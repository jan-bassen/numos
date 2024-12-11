'use client'

import { getAttributeBySlugs } from '@/lib/supabase/db/attributes/read'
import { Button } from '@repo/ui/components/ui/button'
import { fullDatatypeSchema } from '@repo/engine/datatypes/schemas-new/datatype-schema'
import {
  fullBooleanSchema,
  booleanSchema,
} from '@repo/engine/datatypes/schemas-new/datatype-schemas/boolean-schema'
import { updateAttributeSchema } from '@/lib/schemas/attribute-schema-new'

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
