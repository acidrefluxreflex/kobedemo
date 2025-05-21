"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { InfoIcon } from "lucide-react";
import { Product, ProductQuestion } from "@/types/products";

interface MarkdownJsonProps {
  data: any | null;
  className?: string;
}

export function MarkdownJson({ data, className }: MarkdownJsonProps) {
  console.log(data);
  const products = data.recommended_products as Product[] | undefined;
  console.log(products);
  if (products && Array.isArray(products)) {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader className="bg-gradient-to-r from-blue-50 to-slate-50 border-b">
            <CardTitle className="text-lg font-bold text-slate-800">
              推奨製品情報
            </CardTitle>
          </CardHeader>
          
            {/* 推奨製品をそれぞれ表示 */}
            {products.map((product) => (
              <CardContent key={product.product_name} className="border-b last:border-0 py-4">
                {/* 製品名とバッジ */}
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-bold text-slate-800">{product.product_name}</h3>
                  <Badge variant="outline" className="bg-blue-50">
                    おすすめ
                  </Badge>
                </div>
                
                {/* 推奨使用法 */}
                <p className="text-sm text-slate-600 mb-3">{product.recommended_use}</p>
                
                {/* 特徴 */}
                <div className="mb-3">
                  <div className="text-xs uppercase text-slate-500 font-semibold flex items-center gap-1 mb-1">
                    <InfoIcon size={14} /> 特徴
                  </div>
                  <p className="text-sm">{product.features}</p>
                </div>
                
               
                
                {/* 使用例 */}
                <div className="mb-3">
                  <div className="text-xs uppercase text-slate-500 font-semibold mb-1">使用例</div>
                  <ul className="list-disc list-inside text-sm">
                    {Array.isArray(product.examples) && product.examples.map((example, index) => (
                      <li key={index}>{example}</li>
                    ))}
                  </ul>
                </div>

                {/* 価格情報 */}
                <div className="mb-3"> 
                  <div className="text-xs uppercase text-slate-500 font-semibold mb-1">価格</div>
                  {product.pricing_and_sales && product.pricing_and_sales.price ? (
                    <ul className="list-disc list-inside text-sm">
                      {Object.entries(product.pricing_and_sales.price).map(([priceType, priceValue], index) => (
                        <li key={index}>
                          <span className="font-medium">{priceType}:</span> {priceValue}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-sm text-slate-500">価格情報はありません</p>
                  )}
                </div>
                  
                
                {/* マーケティング情報 */}
                {Array.isArray(product.marketing_materials) && product.marketing_materials.length > 0 && (
                  <div className="mt-4 border-t pt-3">
                    <div className="text-xs uppercase text-slate-500 font-semibold mb-1">セールスポイント</div>
                    {product.marketing_materials.map((material, index) => (
                      <TooltipProvider key={index}>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <div className="bg-gradient-to-r from-blue-50 to-slate-50 p-2 rounded mb-2 cursor-help">
                              <div className="font-medium text-sm">{material.title}</div>
                              <div className="text-xs italic">"{material.catchphrase}"</div>
                            </div>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p className="text-xs max-w-xs">{material.selling_points}</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    ))}
                  </div>
                )}

                {/* カタログ情報 */}
                <div className="mt-4 text-xs text-slate-500">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-medium">出典:</span> {product.pricing_and_sales.source}
                    </div>
                    <div>
                      {product.pricing_and_sales && product.pricing_and_sales.annual_sales_volume_kg ? (
                        <span>
                          <span className="font-medium">年間販売量: </span> 
                          {product.pricing_and_sales.annual_sales_volume_kg.toLocaleString()}kg
                        </span>
                      ) : null}
                    </div>
                  </div>
                </div>
              </CardContent>
            ))}
         
        </Card>
      </div>
    );
  }

  // その他の一般的なJSON
  return (
    <Card className={className}>
      <CardHeader className="pb-2 pt-4">
        <CardTitle className="text-lg font-bold">JSONデータ</CardTitle>
      </CardHeader>
      <CardContent>
        <pre className="whitespace-pre-wrap text-sm bg-slate-50 p-3 rounded-md">
          {JSON.stringify(data, null, 2)}
        </pre>
      </CardContent>
    </Card>
  );
}
