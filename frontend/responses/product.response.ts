export interface Product {
  id: number;
  name: string;
  price: number;
  thumbnail: string;
  description: string;
  category?: {
    id: number;
    name: string;
  };
}
