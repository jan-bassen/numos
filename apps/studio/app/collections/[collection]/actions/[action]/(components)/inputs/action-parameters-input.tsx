'use client'

import { useAction } from '@/app/collections/[collection]/actions/[action]/action-context'

export function ActionParametersInput() {
  const {
    action: { trigger },
  } = useAction()
  return <div>ActionParametersInput</div>
}
