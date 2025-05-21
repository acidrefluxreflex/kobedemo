export type ResourceType = 'ドキュメント' | '画像' | '動画' | 'その他';

export interface Resource {
  id: string;
  title: string;
  type: ResourceType;
  size: number; // サイズ（KB）
  createdAt: string;
  updatedAt: string;
}
