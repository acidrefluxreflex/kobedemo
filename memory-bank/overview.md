
## 概要

- 本システムはAIチャットボット
- OpenAI Assistnt APIを使用
- モデルは4.1-mini
- アシスタントからの返答はJSON
- JSONの形式は以下に記載

``` json
{
  "question": "いちごゼリーに使用できる製品は？",
  "answer": {
    "recommended_products": [
      {
        "product_name": "アガー（ゲル化剤）AGAR-100",
        "recommended_use": "フルーツゼリー全般、とくにイチゴなど酸性果実にも適合",
        "features": "高い透明性、なめらかな食感、早いゲル化時間",
        "examples": ["イチゴゼリー", "ミックスフルーツゼリー"],
        "source": "agar_product_guide.pdf"
      },
      {
        "product_name": "着色料 イチゴレッドCL",
        "recommended_use": "着色用（イチゴ果汁の色調強調や調整用）",
        "features": "自然なイチゴ色再現、高い耐熱・耐酸性",
        "source": "color_red_cl_specs.pdf"
      },
      {
        "product_name": "香料 イチゴフレーバーNAT",
        "recommended_use": "香り付け（果実感の向上や補強用）",
        "features": "リアルなイチゴの香気、熱安定性",
        "source": "flavor_nat_catalog.pdf"
      }
    ],
    "pricing_and_volume": [
      {
        "product_name": "アガーAGAR-100",
        "suggested_price_per_kg": "1kgあたり2,800円（業務用）",
        "annual_sales_volume_kg": 1200,
        "source": "agar_pricing_2024.xlsx"
      },
      {
        "product_name": "イチゴレッドCL",
        "suggested_price_per_500g": "500gあたり9,000円",
        "annual_sales_volume_kg": 400,
        "source": "color_market_data.xlsx"
      },
      {
        "product_name": "イチゴフレーバーNAT",
        "suggested_price_per_kg": "1kgあたり12,000円",
        "annual_sales_volume_kg": 200,
        "source": "flavor_sales_stats.xlsx"
      }
    ],
    "product_catalog": [
      {
        "product_name": "アガーAGAR-100",
        "main_ingredients": ["カラギーナン", "ローカストビーンガム"],
        "applications": ["ゼリー", "プリン", "寒天菓子"],
        "packaging": "1kg×10袋（ケース）",
        "storage": "常温保存、直射日光・高温多湿を避ける",
        "source": "agar_product_catalog.pdf"
      },
      {
        "product_name": "イチゴレッドCL",
        "classification": "赤色粉末合成色素 または 天然由来色素",
        "applications": ["ゼリー", "プリン", "グミ", "飲料"],
        "packaging": "500gアルミ包装",
        "source": "color_cl_techsheet.pdf"
      },
      {
        "product_name": "イチゴフレーバーNAT",
        "classification": "天然着香料",
        "applications": ["ゼリー", "ソース", "アイス", "焼菓子"],
        "packaging": ["1kg缶", "ドラム缶"],
        "source": "flavor_nat_specs.pdf"
      }
    ],
    "marketing_materials": [
      {
        "product_name": "アガーAGAR-100",
        "catchphrase": "フルーツの色と味をそのままゲル化！酸にも強い業務用ゼリー基剤",
        "selling_points": "果実本来の風味と透明感を活かし、誰でも簡単に高品質ゼリー製造。温度安定性で大量製造にも対応。",
        "use_case": "イチゴピューレなどの酸性素材でも高いゲル化安定性と舌ざわり。",
        "source": "agar_promo_material.pdf"
      },
      {
        "product_name": "イチゴレッドCL",
        "catchphrase": "鮮やかで自然なイチゴ色を演出！デザート映えする着色料",
        "selling_points": "色ブレが少なく、加熱工程や酸処理でも退色しにくい。天然タイプも品揃え。",
        "source": "color_red_promo.pdf"
      },
      {
        "product_name": "イチゴフレーバーNAT",
        "catchphrase": "フレッシュなイチゴの香りをワンプラス。香気向上で差別化！",
        "selling_points": "イチゴ果汁やピューレが少ない配合でもリアルな風味を補強。",
        "source": "flavor_nat_leaflet.pdf"
      }
    ]
  }
}
```

- 上記JSONに対応するモデルはproductsに記載済み