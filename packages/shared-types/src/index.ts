export type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
  provider?: Provider;
  model?: string;
  createdAt: string;
};

export type Conversation = {
  id: string;
  userId: string;
  title: string;
  provider: Provider;
  model: string;
  createdAt: string;
  updatedAt: string;
  lastMessageAt: string | null;
};

export const Provider = {
  gemini: "gemini",
  deepseek: "deepseek",
} as const;

export type Provider = (typeof Provider)[keyof typeof Provider];
export interface ErrorEnvelope {
  code: string;
  message: string;
  retryable: boolean;
}
