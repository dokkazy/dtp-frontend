import { chatApiRequest } from "@/apiRequests/chat"
import { create } from "zustand"

export type Message = {
  id: string
  role: "user" | "assistant"
  content: string
}

interface ChatState {
  messages: Message[]
  input: string
  isLoading: boolean
  error: string | null
  setInput: (input: string) => void
  sendMessage: (message: string) => Promise<void>
  resetChat: () => void
}

export const useChatStore = create<ChatState>()((set, get) => ({
  messages: [],
  input: "",
  isLoading: false,
  error: null,

  setInput: (input) => set({ input }),

  sendMessage: async (message) => {
    const { isLoading } = get()

    if (!message.trim() || isLoading) return

    // Add user message to the chat
    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: message,
    }

    set((state) => ({
      messages: [...state.messages, userMessage],
      input: "",
      isLoading: true,
      error: null,
    }))

    try {
      const data = await chatApiRequest.chat(message)
      console.log("Response from API:", data)

      // Add assistant message to the chat
      const assistantMessage: Message = {
        id: Date.now().toString(),
        role: "assistant",
        content: data.answer,
      }

      set((state) => ({
        messages: [...state.messages, assistantMessage],
        isLoading: false,
      }))
    } catch (err) {
      console.error("Error fetching from API:", err)
      const errorMessage = err instanceof Error ? err.message : "An unknown error occurred"

      // Add error message to the chat
      const errorAssistantMessage: Message = {
        id: Date.now().toString(),
        role: "assistant",
        content: "Sorry, there was an error processing your request. Please try again.",
      }

      set((state) => ({
        messages: [...state.messages, errorAssistantMessage],
        isLoading: false,
        error: errorMessage,
      }))
    }
  },

  resetChat: () =>
    set({
      messages: [],
      input: "",
      error: null,
    }),
}))

