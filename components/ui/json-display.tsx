"use client";

import { useState } from "react";
import { ChevronDown, ChevronRight, Copy, Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface JsonDisplayProps {
  data: any;
  title?: string;
  className?: string;
  initialExpanded?: boolean;
}

export function JsonDisplay({
  data,
  title,
  className,
  initialExpanded = true,
}: JsonDisplayProps) {
  const [copied, setCopied] = useState(false);
  const [expanded, setExpanded] = useState(initialExpanded);

  const handleCopy = () => {
    navigator.clipboard.writeText(JSON.stringify(data, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // プリミティブ値の表示
  if (
    data === null ||
    typeof data === "undefined" ||
    typeof data === "string" ||
    typeof data === "number" ||
    typeof data === "boolean"
  ) {
    return (
      <div className={cn("font-mono text-sm", className)}>
        {data === null
          ? "null"
          : typeof data === "undefined"
          ? "undefined"
          : typeof data === "string"
          ? `"${data}"`
          : String(data)}
      </div>
    );
  }

  // 配列または対象の場合の表示
  const isArray = Array.isArray(data);
  const isEmpty = isArray ? data.length === 0 : Object.keys(data).length === 0;

  return (
    <div className={cn("rounded-md border", className)}>
      {title && (
        <div className="flex items-center justify-between border-b bg-slate-50 px-3 py-2">
          <h3 className="font-medium text-slate-800">{title}</h3>
          <button
            onClick={handleCopy}
            className="flex items-center gap-1 rounded-md px-2 py-1 text-xs hover:bg-slate-200"
          >
            {copied ? (
              <>
                <Check className="h-3 w-3" />
                <span>コピー済み</span>
              </>
            ) : (
              <>
                <Copy className="h-3 w-3" />
                <span>コピー</span>
              </>
            )}
          </button>
        </div>
      )}

      <div className="p-3">
        {isEmpty ? (
          <div className="text-center text-sm text-gray-500">空のデータです</div>
        ) : (
          <div>
            <button
              onClick={() => setExpanded(!expanded)}
              className="mb-2 flex items-center gap-1 text-xs text-slate-600"
            >
              {expanded ? (
                <ChevronDown className="h-3 w-3" />
              ) : (
                <ChevronRight className="h-3 w-3" />
              )}
              <span>{expanded ? "折りたたむ" : "展開する"}</span>
            </button>

            {expanded && (
              <div className="pl-2">
                {isArray
                  ? // 配列の場合
                    data.map((item: any, index: number) => (
                      <div key={index} className="mb-2">
                        <div className="flex items-start gap-2">
                          <span className="text-xs font-mono text-slate-500">
                            [{index}]
                          </span>
                          {typeof item === "object" && item !== null ? (
                            <JsonDisplay data={item} />
                          ) : (
                            <JsonDisplay data={item} />
                          )}
                        </div>
                      </div>
                    ))
                  : // オブジェクトの場合
                    Object.entries(data).map(([key, value]) => (
                      <div key={key} className="mb-2">
                        <div className="flex items-start gap-2">
                          <span className="text-xs font-semibold text-slate-700">
                            {key}:
                          </span>
                          {typeof value === "object" && value !== null ? (
                            <JsonDisplay data={value} />
                          ) : (
                            <JsonDisplay data={value} />
                          )}
                        </div>
                      </div>
                    ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
