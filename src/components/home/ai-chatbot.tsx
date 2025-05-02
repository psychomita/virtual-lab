"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Bot, X, Send, Loader2 } from "lucide-react"

export function AIChatbot() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Array<{ type: "user" | "bot"; content: string }>>([
    {
      type: "bot",
      content:
        "Hi there! I'm Professor Neutron, your SciNapse lab assistant. How can I help with your science experiments today?",
    },
  ])
  const [input, setInput] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const [isAnimating, setIsAnimating] = useState(false)
  const [isHovered, setIsHovered] = useState(false)

  // Auto-scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim()) return

    // Add user message
    setMessages((prev) => [...prev, { type: "user", content: input }])
    setInput("")

    // Simulate bot typing
    setIsTyping(true)

    // Sample responses based on keywords
    setTimeout(() => {
      let botResponse = "I'm not sure about that. Can you ask me something about science experiments?"

      const lowerInput = input.toLowerCase()

      if (lowerInput.includes("experiment") || lowerInput.includes("lab")) {
        botResponse =
          "We have many exciting experiments in our virtual labs! You can try chemistry reactions, physics simulations, or biology observations. Which subject interests you most?"
      } else if (lowerInput.includes("chemistry") || lowerInput.includes("chemical")) {
        botResponse =
          "Our chemistry lab lets you mix chemicals safely, observe reactions, and learn about molecular structures. Try the copper sulfate and sodium hydroxide experiment - it creates a beautiful blue precipitate!"
      } else if (lowerInput.includes("physics")) {
        botResponse =
          "In our physics lab, you can experiment with forces, electricity, magnetism, and even quantum phenomena! The gravity simulator is particularly popular with students."
      } else if (lowerInput.includes("biology")) {
        botResponse =
          "Our biology lab features virtual dissections, cell observations, and ecosystem simulations. You can even watch plant growth in accelerated time!"
      } else if (lowerInput.includes("hello") || lowerInput.includes("hi")) {
        botResponse =
          "Hello there! I'm Professor Neutron, your virtual lab assistant. What science topic would you like to explore today?"
      } else if (lowerInput.includes("thank")) {
        botResponse = "You're very welcome! Let me know if you need any more help with your scientific explorations."
      }

      setMessages((prev) => [...prev, { type: "bot", content: botResponse }])
      setIsTyping(false)
    }, 1500)
  }

  // Animation for the bot icon
  useEffect(() => {
    const interval = setInterval(() => {
      setIsAnimating((prev) => !prev)
    }, 3000)

    return () => clearInterval(interval)
  }, [])

  return (
    <>
      {/* Chatbot button */}
      <button
        className={`fixed bottom-6 right-6 z-50 flex items-center justify-center w-16 h-16 rounded-full shadow-lg transition-all duration-300 ${
          isHovered ? "scale-110" : "scale-100"
        } ${
          isOpen
            ? "bg-red-500 hover:bg-red-600"
            : "bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-700 hover:to-violet-700"
        }`}
        onClick={() => setIsOpen(!isOpen)}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {isOpen ? (
          <X className="w-6 h-6 text-white" />
        ) : (
          <div className="relative">
            <Bot className="w-8 h-8 text-white" />
            <div
              className={`absolute -top-1 -right-1 w-3 h-3 rounded-full bg-green-400 ${isAnimating ? "animate-ping" : ""}`}
            ></div>
            <div className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-green-400"></div>
          </div>
        )}
      </button>

      {/* Chatbot panel */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 z-50 w-80 sm:w-96 h-96 bg-white dark:bg-slate-900 rounded-xl shadow-2xl flex flex-col border border-slate-200 dark:border-slate-700 overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-violet-600 p-4 text-white flex items-center gap-3">
            <div className="relative flex items-center justify-center w-10 h-10 rounded-full bg-white/20 p-0.5">
              <Bot className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="font-bold">Professor Neutron</h3>
              <p className="text-xs text-white/80">SciNapse Lab Assistant</p>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message, index) => (
              <div key={index} className={`flex ${message.type === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-2 ${
                    message.type === "user"
                      ? "bg-blue-600 text-white rounded-tr-none"
                      : "bg-slate-200 dark:bg-slate-800 text-slate-900 dark:text-slate-100 rounded-tl-none"
                  }`}
                >
                  {message.content}
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex justify-start">
                <div className="max-w-[80%] rounded-2xl px-4 py-2 bg-slate-200 dark:bg-slate-800 text-slate-900 dark:text-slate-100 rounded-tl-none">
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 rounded-full bg-slate-400 dark:bg-slate-500 animate-bounce"></div>
                    <div
                      className="w-2 h-2 rounded-full bg-slate-400 dark:bg-slate-500 animate-bounce"
                      style={{ animationDelay: "0.2s" }}
                    ></div>
                    <div
                      className="w-2 h-2 rounded-full bg-slate-400 dark:bg-slate-500 animate-bounce"
                      style={{ animationDelay: "0.4s" }}
                    ></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <form onSubmit={handleSubmit} className="p-4 border-t border-slate-200 dark:border-slate-700 flex gap-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about experiments..."
              className="flex-1"
            />
            <Button type="submit" size="icon" disabled={!input.trim() || isTyping}>
              {isTyping ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
            </Button>
          </form>
        </div>
      )}
    </>
  )
}
