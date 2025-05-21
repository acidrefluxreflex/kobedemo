import { Select } from "@/components/ui/select";

export function ResourceFilters() {
  return (
    <div className="flex justify-between items-center mb-6">
      <div className="flex items-center space-x-2">
        <span className="text-sm text-gray-600">並び替え</span>
        <select className="border rounded px-2 py-1 text-sm">
          <option value="newest">新しい順</option>
          <option value="oldest">古い順</option>
          <option value="name">名前順</option>
          <option value="size">サイズ順</option>
        </select>
      </div>

      <div className="flex items-center space-x-2">
        <span className="text-sm text-gray-600">表示件数</span>
        <select className="border rounded px-2 py-1 text-sm">
          <option value="10">10件</option>
          <option value="20">20件</option>
          <option value="50">50件</option>
          <option value="100">100件</option>
        </select>
      </div>
    </div>
  );
}
