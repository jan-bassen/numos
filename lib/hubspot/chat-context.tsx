import { createContext, useContext, useEffect, useState } from 'react'

type ChatContextType = {
  chatOpen: boolean
  setChatOpen: (value: boolean) => void
  unreadMessages: boolean
}

const ChatContext = createContext<ChatContextType | null>(null)

export const useChatContext = () => {
  const context = useContext(ChatContext)

  if (!context) {
    throw new Error('useChatContext must be used within a ChatProvider.')
  }
  return context
}

export function ChatProvider({ children }: { children: React.ReactNode }) {
  const [chatOpen, setChatOpen] = useState(false)
  const [unreadMessages, setUnreadMessages] = useState(false)

  if (typeof window !== 'undefined') {
    window.HubSpotConversations?.on(
      'unreadConversationCountChanged',
      (payload) => {
        if (payload.unreadCount === 0) {
          setUnreadMessages(false)
          return
        }
        setUnreadMessages(true)
      },
    )

    window.HubSpotConversations?.on('widgetClosed', () => {
      console.log('widget closed')
    })
  }

  useEffect(() => {
    if (!chatOpen) {
      window.HubSpotConversations?.widget?.refresh()
    }
  }, [chatOpen])

  return (
    <ChatContext.Provider value={{ chatOpen, setChatOpen, unreadMessages }}>
      {children}
    </ChatContext.Provider>
  )
}
