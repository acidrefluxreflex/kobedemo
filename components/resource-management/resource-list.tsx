import { Resource } from "@/types/resources";
import { dummyResources } from "@/data/dummy-resources";
import { Trash2 } from "lucide-react";

export function ResourceList() {
  return (
    <div>
      {/* 機能説明ボックス */}
      <div className="bg-gray-50 border border-gray-200 p-4 mb-6 rounded-md">
        <h3 className="text-sm font-medium mb-2">製品版の機能</h3>
        <p className="text-sm text-gray-600">
          製品版では、このページからドキュメントや各種ファイルを直接アップロードして、知識ベースを拡張できます。
        </p>
      </div>

      {/* リソーステーブル */}
      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b">
            <th className="text-left py-3 px-4 text-sm font-medium text-gray-600 w-5/12">
              タイトル
            </th>
            <th className="text-left py-3 px-4 text-sm font-medium text-gray-600 w-2/12">
              種類
            </th>
            <th className="text-left py-3 px-4 text-sm font-medium text-gray-600 w-2/12">
              サイズ
            </th>
            <th className="text-left py-3 px-4 text-sm font-medium text-gray-600 w-2/12">
              操作
            </th>
          </tr>
        </thead>
        <tbody>
          {dummyResources.map((resource) => (
            <tr key={resource.id} className="border-b hover:bg-gray-50">
              <td className="py-3 px-4 text-sm">
                <div className="flex items-center">
                  <svg
                    className="h-5 w-5 text-gray-400 mr-2"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                  {resource.title}
                </div>
              </td>
              <td className="py-3 px-4 text-sm">{resource.type}</td>
              <td className="py-3 px-4 text-sm">{resource.size} KB</td>
              <td className="py-3 px-4 text-sm">
                <button className="text-gray-500 hover:text-red-600">
                  <Trash2 className="h-4 w-4" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
