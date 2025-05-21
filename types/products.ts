export interface Product {
  product_name: string;
  recommended_use: string;
  features: string;
  examples: string[];
  pricing_and_sales: {
    price: {
      [key: string]: string;
    };
    annual_sales_volume_kg: number;
    source: string;
  };
  catalog_info: {
    summary: string;
    specs: string;
    contact: string;
  };
  marketing_materials: {
    title: string;
    catchphrase: string;
    selling_points: string;
    source: string;
  }[];
}
// 最上位
export interface ProductQuestion {
  question: string;
  answer: Product[];
}
