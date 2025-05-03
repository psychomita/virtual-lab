"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useChat } from "@ai-sdk/react";
import { AlertCircleIcon, Loader2, Send, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import Markdown from "react-markdown";

export function AIChatbot() {
  const [isOpen, setIsOpen] = useState(false);

  const { messages, input, handleInputChange, handleSubmit, status, error } =
    useChat({
      api: "/api/chat",
    });

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  // Auto-scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Animation for the bot icon
  useEffect(() => {
    const interval = setInterval(() => {
      setIsAnimating((prev) => !prev);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <>
      {/* Chatbot button */}
      <button
        className={`fixed right-6 bottom-6 z-50 flex h-16 w-16 cursor-pointer items-center justify-center rounded-full shadow-lg transition-all duration-300 ${
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
          <X className="h-6 w-6 text-white" />
        ) : (
          <div className="relative">
            <img
              src="https://i.ibb.co/Kz83RnFv/chat-bot-icon-virtual-smart-600nw-2478937553.jpg"
              alt="bot"
              className="h-16 w-16 rounded-full object-cover"
            />
            <div
              className={`absolute top-1 right-1 h-3 w-3 rounded-full bg-green-400 ${
                isAnimating ? "animate-ping" : ""
              }`}
            ></div>
            <div className="absolute top-1 right-1 h-3 w-3 rounded-full bg-green-400"></div>
          </div>
        )}
      </button>

      {/* Chatbot panel */}
      {isOpen && (
        <div className="fixed right-6 bottom-24 z-50 flex h-100 w-100 flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-2xl sm:w-100 dark:border-slate-700 dark:bg-slate-900">
          {/* Header */}
          <div className="flex items-center gap-3 bg-gradient-to-r from-blue-600 to-violet-600 p-4 text-white">
            <img
              src="https://i.ibb.co/Kz83RnFv/chat-bot-icon-virtual-smart-600nw-2478937553.jpg"
              alt="bot"
              className="h-10 w-10 rounded-full object-cover"
            />
            <div>
              <h3 className="font-bold">Professor Neutron</h3>
              <p className="text-xs text-white/80">SciNapse Lab Assistant</p>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 space-y-4 overflow-y-auto p-4">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${
                  message.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                {message.role !== "user" && (
                  <img
                    src="https://i.ibb.co/Kz83RnFv/chat-bot-icon-virtual-smart-600nw-2478937553.jpg"
                    alt="bot"
                    className="mr-1 h-7 w-7 rounded-full object-cover"
                    loading="lazy"
                  />
                )}
                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-2 text-xs ${
                    message.role === "user"
                      ? "rounded-tr-none bg-blue-600 text-white"
                      : "rounded-tl-none bg-slate-200 text-slate-900 dark:bg-slate-800 dark:text-slate-100"
                  }`}
                >
                  <Markdown>{message.content}</Markdown>
                </div>
              </div>
            ))}
            {status === "streaming" && (
              <div className="flex justify-start">
                <div className="max-w-[80%] rounded-2xl rounded-tl-none bg-slate-200 px-4 py-2 text-slate-900 dark:bg-slate-800 dark:text-slate-100">
                  <div className="flex items-center gap-1">
                    <div className="h-2 w-2 animate-bounce rounded-full bg-slate-400 dark:bg-slate-500"></div>
                    <div
                      className="h-2 w-2 animate-bounce rounded-full bg-slate-400 dark:bg-slate-500"
                      style={{ animationDelay: "0.2s" }}
                    ></div>
                    <div
                      className="h-2 w-2 animate-bounce rounded-full bg-slate-400 dark:bg-slate-500"
                      style={{ animationDelay: "0.4s" }}
                    ></div>
                  </div>
                </div>
              </div>
            )}
            {error && (
              <div className="flex items-center gap-2 px-2 pt-2 text-xs text-red-600">
                <AlertCircleIcon className="animate-pulse" />
                Oops! An error occurred: {error.message}. Try refreshing.
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <form
            onSubmit={handleSubmit}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSubmit(e);
              }
            }}
            className="flex gap-2 border-t border-slate-200 p-4 dark:border-slate-700"
          >
            <Input
              value={input}
              onChange={handleInputChange}
              placeholder="Ask about experiments..."
              className="flex-1"
            />
            <Button
              type="submit"
              size="icon"
              disabled={!input.trim() || status === "streaming"}
              className="h-10 w-10 rounded-full bg-blue-600 text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-300"
            >
              {status === "streaming" ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
            </Button>
          </form>
        </div>
      )}
    </>
  );
}
