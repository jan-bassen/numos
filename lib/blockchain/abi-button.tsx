'use client'

import { Button } from '@repo/ui/components/button'
import { getImplementation, isERC721 } from './test'
import { toast } from 'sonner'
import { get } from 'lodash'

const baycAddress = '0xBC4CA0EdA7647A8aB7C2061c2E118A18a936f13D'
const blubProxyAddress = '0x4f16e786f81c8cd3dEf695Ae8fC653F70Cf52B63'
const blubImplAddress = '0x07aee92b7C5977F5EC15d20BaC713A21f72F287B'
const falseAddress = '0x0000000000000000000000000000000000000000'

export function AbiButton() {
  return (
    <Button
      onClick={async () => {
        getImplementation('sepolia', blubProxyAddress)
        /*         const { result, error } = await isERC721('sepolia', blubImplAddress)
        if (error) {
          toast.error(error)
          return
        }
        toast.success('Yes, contract is ERC721!') */
      }}
    >
      Test BLUB
    </Button>
  )
}
