import type { SpecificNodeDefinition } from '@/types/nodes.types'
import type { AddressInputNode } from '@repo/engine/nodes/address-input/interface'

export const addressInputDefinition: SpecificNodeDefinition<AddressInputNode> =
  {
    type: 'address-input',
    category: 'data',
    title: 'Address',
    root: false,
    componentType: 'input',
    nodeInfo: {
      description: 'This node allows you to input a blockchain address.',
      example: '0xBC4CA0EdA7647A8aB7C2061c2E118A18a936f13D',
      link: '#address-input',
    },
    controls: [
      {
        key: 'address',
        type: 'address',
        placeholder: '0xBC4CA0EdA7647A8aB7C2061c2E118A18a936f13D',
      },
    ],
    outputs: [{ key: 'output', type: 'address', label: 'Address' }],
  }
