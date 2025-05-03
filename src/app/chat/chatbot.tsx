"use client";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useChat } from "@ai-sdk/react";
import {
  AlertCircle,
  Copy,
  Loader2,
  Send,
  Sparkles,
  User2Icon,
} from "lucide-react";
import { useEffect, useRef } from "react";
import Markdown from "react-markdown";
import { motion } from "motion/react";

export default function Chatbox() {
  const { messages, input, handleInputChange, handleSubmit, status, error } =
    useChat({
      api: "/api/chat",
    });

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <div className="mx-auto flex h-[95vh] w-full max-w-5xl flex-col justify-between px-4 pt-6">
      {/* Chat area */}
      <div className="border-border/40 bg-muted/10 flex-1 space-y-2 overflow-y-auto rounded-lg border p-4 text-sm leading-6 sm:text-base sm:leading-7">
        {messages.length > 0 ? (
          messages.map((m) => (
            <motion.div
              key={m.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
              className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
            >
              {m.role !== "user" ? (
                <img
                  src="https://i.ibb.co/Kz83RnFv/chat-bot-icon-virtual-smart-600nw-2478937553.jpg"
                  alt="bot"
                  className="mr-2 h-10 w-10 rounded-full object-cover"
                  loading="lazy"
                />
              ) : null}
              <div
                className={`relative max-w-[70%] rounded-2xl px-4 py-2 text-sm ${
                  m.role === "user"
                    ? "rounded-tr-none bg-blue-600 text-white"
                    : "rounded-tl-none bg-zinc-100 text-black dark:bg-zinc-800 dark:text-white"
                }`}
              >
                <Markdown>{m.content}</Markdown>
                {m.role !== "user" && (
                  <Button
                    type="button"
                    title="copy"
                    variant={"ghost"}
                    size={"icon"}
                    className="absolute top-2 right-2 opacity-60 hover:opacity-100"
                    onClick={() => {
                      navigator.clipboard.writeText(m.content);
                      alert("Copied to clipboard");
                    }}
                  >
                    <Copy size={14} />
                  </Button>
                )}
              </div>
              {m.role === "user" ? (
                <User2Icon className="ml-2 h-6 w-6 text-blue-500" />
              ) : null}
            </motion.div>
          ))
        ) : (
          <div className="m-auto flex h-full flex-col items-center justify-center text-center">
            <div className="mb-4 grid size-12 place-content-center overflow-clip rounded-full bg-blue-500 text-white">
              <img
                src="https://i.ibb.co/Kz83RnFv/chat-bot-icon-virtual-smart-600nw-2478937553.jpg"
                alt="bot"
                className="h-20 w-20 rounded-full object-cover"
                loading="lazy"
              />
            </div>
            <h1 className="text-2xl font-bold">Hi, I&apos;m Prof. Neutron!</h1>
            <p className="text-muted-foreground mt-2 max-w-2xl text-sm sm:text-base">
              Ask me anything about science, and I will do my best to help you.
            </p>
          </div>
        )}
        {status === "streaming" && (
          <div className="flex items-center gap-2 px-2 pt-2">
            <span className="text-muted-foreground animate-pulse">
              Generating...
            </span>
            <Sparkles size={18} className="animate-pulse text-blue-400" />
          </div>
        )}
        {error && (
          <div className="flex items-center gap-2 px-2 pt-2 text-sm text-red-600">
            <AlertCircle className="animate-pulse" />
            Oops! An error occurred: {error.message}. Try refreshing.
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input area */}
      <form
        className="border-border bg-background w-full py-3"
        onSubmit={handleSubmit}
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSubmit(e);
          }
        }}
      >
        <label htmlFor="chat-input" className="sr-only">
          Enter your prompt
        </label>
        <div className="relative">
          <Textarea
            id="chat-input"
            placeholder="Type your message..."
            rows={1}
            className="resize-none rounded-xl pr-14"
            value={input}
            required
            onChange={handleInputChange}
          />
          <Button
            title="Send"
            type="submit"
            disabled={!input || status === "streaming"}
            className="absolute top-2 right-2"
          >
            {status === "streaming" ? (
              <>
                Loading
                <Loader2 className="ml-2 animate-spin" size={18} />
              </>
            ) : (
              <>
                Send <Send className="ml-2" size={18} />
              </>
            )}
            <span className="sr-only">Send message</span>
          </Button>
        </div>
      </form>
    </div>
  );
}
