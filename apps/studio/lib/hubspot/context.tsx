import { createContext, useContext, useState } from 'react'

type ChatContextType = {
  chatOpen: boolean
  setChatOpen: (value: boolean) => void
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
  return (
    <ChatContext.Provider value={{ chatOpen, setChatOpen }}>
      {children}
    </ChatContext.Provider>
  )
}
