import { Suspense } from "react";
import Chatbox from "./chatbot";

export default function ChatPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Chatbox />
    </Suspense>
  );
}
