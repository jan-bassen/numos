import { cookies } from 'next/headers'
import { createOrGetTask, getTask, updateTask } from './tasks'
import { getUser } from '@/server/auth/get-user'
import type { ImportingState } from '@/server/sync/sync-account'

export const dynamic = 'force-dynamic'

async function mockSyncWallets(
  task: ImportingState,
  updateTask: (task: ImportingState) => void,
  complete: () => void,
) {
  while (!task.completed) {
    await new Promise((res) => setTimeout(res, 1000))
    task.progress += 20
    if (task.progress >= 100) {
      task.completed = new Date()
      complete()
    }
    updateTask(task)
  }
}

export async function GET() {
  const encoder = new TextEncoder()

  const user = await getUser()
  if (!user) {
    return new Response('Unauthorized', { status: 401 })
  }
  const userId = user.id

  const stream = new ReadableStream({
    async start(controller) {
      const task = createOrGetTask(userId)

      if (task.completed) {
        controller.enqueue(
          encoder.encode(`event: end\ndata: ${JSON.stringify(task)}\n\n`),
        )
        controller.close()
        return
      }

      controller.enqueue(encoder.encode(`data: ${JSON.stringify(task)}\n\n`))

      await mockSyncWallets(
        task,
        (task) => {
          updateTask(userId, task)
          controller.enqueue(
            encoder.encode(`data: ${JSON.stringify(task)}\n\n`),
          )
        },
        () => {
          controller.enqueue(
            encoder.encode(`event: end\ndata: ${JSON.stringify(task)}\n\n`),
          )
          controller.close()
        },
      )

      controller.close()
    },
  })

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      Connection: 'keep-alive',
    },
  })
}
