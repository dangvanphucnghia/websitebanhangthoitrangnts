export interface OrderResponse {
  id: number;
  fullName: string;
  email: string;
  phoneNumber: string;
  address: string;
  note: string;
  orderDate: string;
  status: string;
  totalMoney: number;
  shippingMethod: string;
  shippingAddress: string;
  trackingNumber?: string;
  paymentMethod: string;
}
