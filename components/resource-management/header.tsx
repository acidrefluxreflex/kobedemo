import { Input } from "@/components/ui/input";

export function ResourceHeader() {
  return (
    <div className="mb-6">
      <h1 className="text-2xl font-bold mb-4">リソース管理</h1>
      <div className="relative">
        <Input
          type="search"
          placeholder="リソースを検索..."
          className="max-w-md"
        />
        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
          <svg
            className="h-4 w-4 text-gray-400"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
      </div>
    </div>
  );
}
