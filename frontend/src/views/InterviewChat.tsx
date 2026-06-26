import React, { useState, useEffect, useRef } from "react"
import { Send, ChevronRight, CheckCircle } from "lucide-react"

interface Message {
  role: "ai" | "user";
  content: string;
}

interface InterviewChatProps {
  onSkip: () => void;
  onComplete: () => void;
}

export function InterviewChat({ onSkip, onComplete }: InterviewChatProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [inputValue, setInputValue] = useState("")
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)
  const [isComplete, setIsComplete] = useState(false)
  const endOfMessagesRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Only fetch state once on mount
    let isMounted = true
    const initFetch = async () => {
        try {
          const res = await fetch("/api/chat.php", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ action: "get_state" })
          })
          const data = await res.json()
          if (data.success && isMounted) {
            setMessages(data.chat_history || [])
            setIsComplete(data.is_complete)
          }
        } catch (err) {
          console.error("Failed to fetch chat state:", err)
        } finally {
          if (isMounted) setLoading(false)
        }
    }
    initFetch()
    return () => { isMounted = false }
  }, [])

  useEffect(() => {
    endOfMessagesRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!inputValue.trim() || sending) return

    const userMessage = inputValue.trim()
    setInputValue("")
    setMessages(prev => [...prev, { role: "user", content: userMessage }])
    setSending(true)

    try {
      const res = await fetch("/api/chat.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "send_message", message: userMessage })
      })
      const data = await res.json()
      if (data.success) {
        setMessages(data.chat_history)
        setIsComplete(data.is_complete)
      } else {
        // Remove optimistic message on failure
        setMessages(prev => prev.filter(m => m.content !== userMessage))
      }
    } catch (err) {
      console.error("Failed to send message:", err)
      setMessages(prev => prev.filter(m => m.content !== userMessage))
    } finally {
      setSending(false)
    }
  }

  if (loading) {
    return (
      <div className="flex h-full min-h-[400px] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-500 border-t-transparent" />
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full bg-background rounded-xl border border-border shadow-sm overflow-hidden min-h-[600px] max-h-[80vh]">
      <div className="flex items-center justify-between p-4 border-b border-border bg-muted/30">
        <div className="flex flex-col">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            AI Interviewer <span className="flex h-2 w-2 rounded-full bg-green-500"></span>
          </h2>
          <p className="text-xs text-muted-foreground">Complete your profile setup by answering a few questions</p>
        </div>
        {!isComplete && (
          <button
            onClick={onSkip}
            disabled={sending}
            className="text-xs font-semibold text-muted-foreground hover:text-foreground disabled:opacity-50 disabled:cursor-not-allowed transition flex items-center gap-1"
          >
            Skip for now <ChevronRight className="h-3 w-3" />
          </button>
        )}
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-muted/10">
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
            <div
              className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm ${
                msg.role === "user"
                  ? "bg-indigo-600 text-white rounded-br-none"
                  : "bg-muted text-foreground border border-border rounded-bl-none"
              }`}
            >
              {msg.content}
            </div>
          </div>
        ))}
        {sending && (
          <div className="flex justify-start">
            <div className="max-w-[80%] rounded-2xl px-4 py-3 bg-muted text-foreground border border-border rounded-bl-none flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: "0ms" }}></span>
              <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: "150ms" }}></span>
              <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: "300ms" }}></span>
            </div>
          </div>
        )}
        <div ref={endOfMessagesRef} />
      </div>

      <div className="p-4 border-t border-border bg-background">
        {isComplete ? (
          <div className="flex flex-col items-center justify-center gap-3 py-2">
            <div className="flex items-center gap-2 text-green-500 font-semibold">
              <CheckCircle className="h-5 w-5" />
              <span>Interview Completed Successfully</span>
            </div>
            <button
              onClick={onComplete}
              className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm rounded-lg shadow transition"
            >
              Go to Dashboard
            </button>
          </div>
        ) : (
          <form onSubmit={handleSendMessage} className="flex items-center gap-2 relative">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Type your answer here..."
              disabled={sending}
              className="flex-1 bg-muted/50 border border-border rounded-full pl-4 pr-12 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition"
            />
            <button
              type="submit"
              disabled={!inputValue.trim() || sending}
              className="absolute right-1.5 p-1.5 bg-indigo-600 hover:bg-indigo-700 disabled:bg-muted disabled:text-muted-foreground text-white rounded-full transition"
            >
              <Send className="h-4 w-4 ml-0.5" />
            </button>
          </form>
        )}
      </div>
    </div>
  )
}
