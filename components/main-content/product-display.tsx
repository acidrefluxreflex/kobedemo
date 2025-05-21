"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { ProductQuestion, Product } from "@/types/products";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Separator } from "@/components/ui/separator";
import {
  Beaker,
  DollarSign,
  BookOpen,
  Megaphone,
  ShoppingBag,
  FileText,
  CheckCircle,
  Tag,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface ProductDisplayProps {
  data: ProductQuestion;
}

export function ProductDisplay({ data }: ProductDisplayProps) {
  if (!data.answer || !data.answer.length) return null;

  const products = data.answer;

  return (
    <div className="w-full max-w-3xl mx-auto my-4">
      <Card>
        <CardHeader className="bg-gradient-to-r from-blue-50 to-slate-50 border-b">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-bold text-slate-800">
              {data.question}
            </CardTitle>
            <Badge variant="outline" className="text-xs px-2 py-1 bg-white">
              製品情報
            </Badge>
          </div>
          <CardDescription className="mt-2 text-blue-600">
            以下の情報から最適な製品をご検討ください
          </CardDescription>
        </CardHeader>
        <CardContent className="p-4">
          <Tabs defaultValue="recommended" className="w-full">
            <TabsList className="grid w-full grid-cols-4 bg-slate-100">
              <TabsTrigger
                value="recommended"
                className="data-[state=active]:bg-blue-100 data-[state=active]:text-blue-800"
              >
                <Beaker className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">おすすめ製品</span>
                <span className="sm:hidden">おすすめ</span>
              </TabsTrigger>
              <TabsTrigger
                value="pricing"
                className="data-[state=active]:bg-green-100 data-[state=active]:text-green-800"
              >
                <DollarSign className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">価格・販売量</span>
                <span className="sm:hidden">価格</span>
              </TabsTrigger>
              <TabsTrigger
                value="catalog"
                className="data-[state=active]:bg-amber-100 data-[state=active]:text-amber-800"
              >
                <BookOpen className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">製品仕様</span>
                <span className="sm:hidden">仕様</span>
              </TabsTrigger>
              <TabsTrigger
                value="marketing"
                className="data-[state=active]:bg-purple-100 data-[state=active]:text-purple-800"
              >
                <Megaphone className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">販促資料</span>
                <span className="sm:hidden">販促</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent
              value="recommended"
              className="space-y-6 mt-6 animate-in fade-in-50 duration-300"
            >
              {products.map((product, i) => (
                <Card
                  key={i}
                  className="overflow-hidden border-blue-100 shadow-sm hover:shadow transition-shadow duration-200"
                >
                  <CardHeader className="bg-gradient-to-r from-blue-100 to-blue-50 p-4 border-b border-blue-100">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                        <CheckCircle className="h-5 w-5 mr-2 text-blue-600" />
                        <CardTitle className="text-md font-semibold text-blue-800">
                          {product.product_name}
                        </CardTitle>
                      </div>
                      <Badge className="bg-blue-600">
                        {i === 0 ? "最適" : "推奨"}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="p-5 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2 p-3 bg-blue-50 rounded-md border border-blue-100">
                        <div className="flex items-center">
                          <ShoppingBag className="h-4 w-4 mr-2 text-blue-600" />
                          <div className="font-semibold text-sm text-blue-800">
                            用途
                          </div>
                        </div>
                        <div className="text-sm pl-6">
                          {product.recommended_use}
                        </div>
                      </div>
                      <div className="space-y-2 p-3 bg-blue-50 rounded-md border border-blue-100">
                        <div className="flex items-center">
                          <Tag className="h-4 w-4 mr-2 text-blue-600" />
                          <div className="font-semibold text-sm text-blue-800">
                            特徴
                          </div>
                        </div>
                        <div className="text-sm pl-6">{product.features}</div>
                      </div>
                    </div>

                    {product.examples && (
                      <div className="p-3 bg-white rounded-md border border-blue-100">
                        <div className="flex items-center mb-2">
                          <FileText className="h-4 w-4 mr-2 text-blue-600" />
                          <div className="font-semibold text-sm text-blue-800">
                            使用例
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-2 pl-6">
                          {product.examples.map((example, i) => (
                            <Badge
                              key={i}
                              variant="outline"
                              className="bg-blue-50"
                            >
                              {example}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="flex justify-end mt-2">
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Badge
                              variant="secondary"
                              className="cursor-help text-xs"
                            >
                              出典
                            </Badge>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p className="text-xs">{product.pricing_and_sales.source}</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>

            <TabsContent
              value="pricing"
              className="space-y-6 mt-6 animate-in fade-in-50 duration-300"
            >
              {products.map((product, i) => (
                <Card
                  key={i}
                  className="overflow-hidden border-green-100 shadow-sm hover:shadow transition-shadow duration-200"
                >
                  <CardHeader className="bg-gradient-to-r from-green-100 to-green-50 p-4 border-b border-green-100">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                        <DollarSign className="h-5 w-5 mr-2 text-green-600" />
                        <CardTitle className="text-md font-semibold text-green-800">
                          {product.product_name}
                        </CardTitle>
                      </div>
                      <Badge className="bg-green-600">価格情報</Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="p-5">
                    <div className="bg-white rounded-lg border border-green-100 p-4 flex flex-col md:flex-row justify-between gap-4">
                      <div className="flex-1 flex items-center p-3 bg-green-50 rounded-md">
                        <div className="p-2 bg-green-100 rounded-full mr-3">
                          <DollarSign className="h-6 w-6 text-green-700" />
                        </div>
                        <div>
                          <div className="font-semibold text-sm text-green-800">
                            推奨価格
                          </div>
                          <div className="text-lg font-bold text-green-900">
                            {Object.values(product.pricing_and_sales.price)[0]}
                          </div>
                        </div>
                      </div>

                      <div className="flex-1 flex items-center p-3 bg-green-50 rounded-md">
                        <div className="p-2 bg-green-100 rounded-full mr-3">
                          <ShoppingBag className="h-6 w-6 text-green-700" />
                        </div>
                        <div>
                          <div className="font-semibold text-sm text-green-800">
                            年間販売量
                          </div>
                          <div className="text-lg font-bold text-green-900">
                            {product.pricing_and_sales.annual_sales_volume_kg.toLocaleString()} kg
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-end mt-4">
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Badge
                              variant="secondary"
                              className="cursor-help text-xs"
                            >
                              出典
                            </Badge>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p className="text-xs">{product.pricing_and_sales.source}</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>

            <TabsContent
              value="catalog"
              className="space-y-6 mt-6 animate-in fade-in-50 duration-300"
            >
              {products.map((product, i) => (
                <Card
                  key={i}
                  className="overflow-hidden border-amber-100 shadow-sm hover:shadow transition-shadow duration-200"
                >
                  <CardHeader className="bg-gradient-to-r from-amber-100 to-amber-50 p-4 border-b border-amber-100">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                        <BookOpen className="h-5 w-5 mr-2 text-amber-600" />
                        <CardTitle className="text-md font-semibold text-amber-800">
                          {product.product_name}
                        </CardTitle>
                      </div>
                      <Badge className="bg-amber-600">製品仕様</Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="p-5 space-y-4">
                    <div className="bg-white rounded-lg border border-amber-100 p-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="flex p-3 bg-amber-50 rounded-md">
                          <div className="mr-3">
                            <Tag className="h-5 w-5 text-amber-600" />
                          </div>
                          <div>
                            <div className="font-semibold text-xs text-amber-800">
                              概要
                            </div>
                            <div className="text-sm text-amber-900">
                              {product.catalog_info.summary}
                            </div>
                          </div>
                        </div>

                        <div className="flex p-3 bg-amber-50 rounded-md">
                          <div className="mr-3">
                            <ShoppingBag className="h-5 w-5 text-amber-600" />
                          </div>
                          <div>
                            <div className="font-semibold text-xs text-amber-800">
                              仕様
                            </div>
                            <div className="text-sm text-amber-900">
                              {product.catalog_info.specs}
                            </div>
                          </div>
                        </div>
                      </div>

                      <Separator className="my-4 bg-amber-100" />

                      <div className="space-y-3">
                        <div className="flex items-center">
                          <FileText className="h-5 w-5 mr-2 text-amber-600" />
                          <div className="font-semibold text-sm text-amber-800">
                            用途
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-2 pl-7">
                          <Badge
                            className="bg-amber-100 text-amber-800 hover:bg-amber-200"
                          >
                            {product.recommended_use}
                          </Badge>
                        </div>
                      </div>

                      <div className="mt-4 pt-4 border-t border-amber-100">
                        <div className="flex items-start">
                          <div className="p-1 bg-amber-100 rounded-full mr-2">
                            <BookOpen className="h-4 w-4 text-amber-700" />
                          </div>
                          <div>
                            <div className="font-semibold text-xs text-amber-800">
                              連絡先
                            </div>
                            <div className="text-sm text-amber-900">
                              {product.catalog_info.contact}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-end">
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Badge
                              variant="secondary"
                              className="cursor-help text-xs"
                            >
                              出典
                            </Badge>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p className="text-xs">{product.pricing_and_sales.source}</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>

            <TabsContent
              value="marketing"
              className="space-y-6 mt-6 animate-in fade-in-50 duration-300"
            >
              {products.map((product, i) => (
                <Card
                  key={i}
                  className="overflow-hidden border-purple-100 shadow-sm hover:shadow transition-shadow duration-200"
                >
                  <CardHeader className="bg-gradient-to-r from-purple-100 to-purple-50 p-4 border-b border-purple-100">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                        <Megaphone className="h-5 w-5 mr-2 text-purple-600" />
                        <CardTitle className="text-md font-semibold text-purple-800">
                          {product.product_name}
                        </CardTitle>
                      </div>
                      <Badge className="bg-purple-600">販促資料</Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="p-5 space-y-4">
                    <div className="bg-white rounded-lg border border-purple-100 p-4">
                      {product.marketing_materials && product.marketing_materials.length > 0 && (
                        <div>
                          {product.marketing_materials.map((material, index) => (
                            <div key={index} className="bg-purple-50 border border-purple-100 rounded-md p-4 mb-4">
                              <div className="text-lg font-bold text-purple-800 border-b border-purple-200 pb-2 mb-3">
                                {material.catchphrase}
                              </div>
                              <div className="ml-3 text-sm text-purple-900 italic pl-2 border-l-2 border-purple-300">
                                {material.selling_points}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}

                      <div className="border-t border-purple-100 pt-4 mt-4">
                        <div className="flex items-start">
                          <div className="mr-3">
                            <CheckCircle className="h-5 w-5 text-purple-600" />
                          </div>
                          <div>
                            <div className="font-semibold text-sm text-purple-800">
                              使用例
                            </div>
                            <div className="text-sm pl-2 mt-1 text-purple-900">
                              {product.examples.join(", ")}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-end">
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Badge
                              variant="secondary"
                              className="cursor-help text-xs"
                            >
                              出典
                            </Badge>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p className="text-xs">{product.marketing_materials?.[0]?.source || product.pricing_and_sales.source}</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
