// ChatProvider interface — implemented by GeminiAdapter and DeepSeekAdapter in E3
export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export interface ChatProvider {
  sendMessage(messages: ChatMessage[], model: string): Promise<string>;
}
