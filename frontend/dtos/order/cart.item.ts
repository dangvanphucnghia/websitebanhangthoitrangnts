import { Product } from "../../responses/product.response";
export interface CartItem {
  product: Product;
  quantity: number;
  color?: string;
  size?: string;
}
