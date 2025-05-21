import { ProductQuestion } from "./products";

// メッセージの型
export interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  createdAt: Date;
}

// チャット状態の型
export interface ChatState {
  messages: Message[];
  isLoading: boolean;
  error: string | null;
  resultData: ProductQuestion | null;
}

// APIレスポンスの型
export interface ApiResponse {
  success: boolean;
  data?: any;
  error?: string;
  fromCache?: boolean; // キャッシュからの応答を識別するためのフラグ
}
