import OpenAI from 'openai';

// OpenAI clientのシングルトンインスタンス
export const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// アシスタントIDを環境変数から取得
export const ASSISTANT_ID = process.env.ASSISTANT_ID;
