import { getUser } from '@/server/auth/get-user'
import { syncAccount, type WalletSyncUpdate } from '@/server/sync/sync-account'
import type { User } from 'better-auth'
import { type NextRequest, NextResponse } from 'next/server'

async function mockSyncWallets(
  user: User,
  notify: (message: WalletSyncUpdate) => void,
) {
  for (let i = 0; i < 10; i++) {
    const status: WalletSyncUpdate = {
      chain: 'ethereum',
      wallet: i,
      status: 'pending',
      message: 'Syncing wallets...',
    }
    notify(status)
    await new Promise((resolve) => {
      setTimeout(() => {
        resolve({ message: 'Wallets synced' })
      }, 1000)
    })
    status.status = 'success'
    status.message = 'Wallet synced'
    notify(status)
  }
}

export async function GET(request: NextRequest) {
  const { signal } = request

  //TODO: MAKE SURE ONLY ONE SYNC IS RUNNING AT A TIME PER USER

  const user = await getUser()

  const stream = new ReadableStream({
    async start(controller) {
      console.log('STARTING STREAM')
      if (!user) {
        controller.enqueue(
          `data: ${JSON.stringify({ error: 'Unauthorized' })}\n\n`,
        )
        controller.close()
        return
      }
      try {
        await mockSyncWallets(user, (message) => {
          if (!signal.aborted) {
            controller.enqueue(`data: ${JSON.stringify(message)}\n\n`)
          }
        })
      } catch (error) {
        controller.error(error)
      } finally {
        setTimeout(() => {
          controller.close()
        }, 1000)
      }

      signal.addEventListener('abort', () => {
        controller.close()
      })
    },
  })

  return new NextResponse(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      Connection: 'keep-alive',
    },
  })
}
