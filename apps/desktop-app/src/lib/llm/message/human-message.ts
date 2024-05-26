import { Message } from "./message.interface";

export function HumanMessage(content: string): Message {
  return { role: "user", content };
}

