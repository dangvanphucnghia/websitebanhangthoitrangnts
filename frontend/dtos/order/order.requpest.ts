export interface OrderRequest {
  fullName: string;
  email: string;
  phoneNumber: string;
  address: string;
  note?: string;
  totalMoney: number;
  shippingMethod: string;
  shippingAddress: string;
  paymentMethod: string;
  orderDetails: Array<{
    productId: number;
    quantity: number;
    price: number;
  }>;
}
