import React, { useState, useEffect, useRef } from 'react'
import { MessageSquare, X, Send, Loader2, Bot, User, Sparkles, AlertCircle } from 'lucide-react'
import { supabase } from '../lib/supabaseClient'
import { useAuth } from '../context/SupabaseAuthContext'
import { generateChatResponse } from '../lib/gemini'

interface Message {
  id: string
  text: string
  isUser: boolean
  timestamp: Date
  isError?: boolean
}

export const Chatbot = () => {
  const { user } = useAuth()
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [initialized, setInitialized] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages, isOpen])

  // Load chat history when chat opens
  useEffect(() => {
    if (isOpen && user && !initialized) {
      loadChatHistory()
    }
  }, [isOpen, user, initialized])

  const loadChatHistory = async () => {
    try {
      const { data } = await supabase
        .from('chat_messages')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: true })
        .limit(50)

      if (data) {
        const formattedMessages = data.map((msg: any) => ({
          id: msg.id,
          text: msg.message,
          isUser: msg.role === 'user',
          timestamp: new Date(msg.created_at),
        }))
        setMessages(formattedMessages)
      }
      setInitialized(true)
    } catch (error) {
      console.error('Error loading chat history:', error)
      setInitialized(true)
    }
  }

  const handleSend = async () => {
    if (!input.trim() || !user) return

    const userMessage: Message = {
      id: Date.now().toString(),
      text: input,
      isUser: true,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput('')
    setLoading(true)

    try {
      // Save user message to DB
      const { error: dbError } = await supabase.from('chat_messages').insert({
        user_id: user.id,
        message: userMessage.text,
        role: 'user',
      })

      if (dbError) console.error("Database save error (User):", dbError);

      // Get AI response
      const aiResponse = await generateChatResponse(userMessage.text, messages.map(m => ({
        role: m.isUser ? 'user' : 'ai',
        message: m.text
      })))

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: aiResponse,
        isUser: false,
        timestamp: new Date(),
      }

      // Save AI message to DB
      const { error: dbResponseError } = await supabase.from('chat_messages').insert({
        user_id: user.id,
        message: aiMessage.text,
        role: 'ai',
      })

      if (dbResponseError) console.error("Database save error (AI):", dbResponseError);

      setMessages((prev) => [...prev, aiMessage])
    } catch (error) {
      console.error('Error in chat flow:', error)
      const errorMessage: Message = {
        id: (Date.now() + 2).toString(),
        text: 'Unable to connect to the AI service. Please verify your connection.',
        isUser: false,
        timestamp: new Date(),
        isError: true
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setLoading(false)
    }
  }

  if (!user) return null

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {isOpen && (
        <div className="mb-4 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-[22rem] sm:w-96 h-[32rem] flex flex-col border border-slate-200 dark:border-slate-700 overflow-hidden ring-1 ring-slate-900/5 transition-all duration-200">
          {/* Header */}
          <div className="bg-slate-900 dark:bg-slate-950 text-white p-4 flex justify-between items-center border-b border-slate-800">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-emerald-500/10 rounded-lg">
                <Bot size={20} className="text-emerald-400" />
              </div>
              <div>
                <h3 className="font-semibold text-sm">Pothole Assistant</h3>
                <p className="text-xs text-slate-400 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Online
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="hover:bg-white/10 p-2 rounded-lg transition-colors text-slate-400 hover:text-white"
            >
              <X size={18} />
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50 dark:bg-slate-900/50 scrollbar-thin scrollbar-thumb-slate-200 dark:scrollbar-thumb-slate-700">
            {messages.length === 0 && (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-500 dark:text-slate-400 space-y-3 opacity-80">
                <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-900/30 rounded-xl flex items-center justify-center mb-2">
                  <Sparkles size={24} className="text-emerald-600 dark:text-emerald-400" />
                </div>
                <p className="font-medium text-slate-900 dark:text-white">How can I help you?</p>
                <p className="text-xs max-w-[200px]">Ask about reporting potholes, tracking status, or app features.</p>
              </div>
            )}

            {messages.map((msg) => (
              <div key={msg.id} className={`flex gap-3 ${msg.isUser ? 'justify-end' : 'justify-start'}`}>
                {!msg.isUser && (
                  <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center flex-shrink-0 border border-slate-200 dark:border-slate-700">
                    <Bot size={14} className="text-slate-600 dark:text-slate-400" />
                  </div>
                )}

                <div
                  className={`max-w-[80%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${msg.isError
                      ? 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 border border-red-100 dark:border-red-900/30'
                      : msg.isUser
                        ? 'bg-slate-900 dark:bg-emerald-600 text-white rounded-tr-sm'
                        : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 shadow-sm rounded-tl-sm'
                    }`}
                >
                  {msg.isError && <AlertCircle size={14} className="inline mr-2 -mt-0.5" />}
                  {msg.text}
                </div>

                {msg.isUser && (
                  <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center flex-shrink-0">
                    <User size={14} className="text-slate-600 dark:text-slate-300" />
                  </div>
                )}
              </div>
            ))}

            {loading && (
              <div className="flex gap-3 justify-start">
                <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center flex-shrink-0 border border-slate-200 dark:border-slate-700">
                  <Bot size={14} className="text-slate-600 dark:text-slate-400" />
                </div>
                <div className="bg-white dark:bg-slate-800 px-4 py-3 rounded-2xl rounded-tl-sm border border-slate-100 dark:border-slate-700 shadow-sm flex items-center gap-2">
                  <Loader2 size={16} className="animate-spin text-emerald-500" />
                  <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Processing...</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-3 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800">
            <div className="flex gap-2 items-end bg-slate-100 dark:bg-slate-800/50 p-2 rounded-xl border border-transparent focus-within:border-slate-300 dark:focus-within:border-slate-600 focus-within:bg-white dark:focus-within:bg-slate-800 transition-all">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault()
                    if (!loading) handleSend()
                  }
                }}
                placeholder="Type your message..."
                disabled={loading}
                rows={1}
                className="flex-1 bg-transparent border-none focus:ring-0 resize-none text-sm py-2 px-2 text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400 max-h-32 disabled:opacity-50"
              />
              <button
                onClick={handleSend}
                disabled={loading || !input.trim()}
                className="p-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                title="Send message"
              >
                <Send size={18} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`${isOpen ? 'scale-0 opacity-0' : 'scale-100 opacity-100'
          } transform transition-all duration-200 bg-slate-900 dark:bg-emerald-600 hover:bg-slate-800 dark:hover:bg-emerald-700 text-white rounded-full p-4 shadow-xl hover:shadow-2xl flex items-center justify-center group`}
      >
        <MessageSquare size={24} className="group-hover:scale-110 transition-transform" />
        <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-white dark:border-slate-900"></span>
      </button>
    </div>
  )
}
