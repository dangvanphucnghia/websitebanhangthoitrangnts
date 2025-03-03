import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable, BehaviorSubject } from "rxjs";
import { OrderResponse } from "../responses/order.response";
import { OrderRequest } from "../dtos/order/order.requpest";
import { CartItem } from "../dtos/order/cart.item";

@Injectable({
  providedIn: "root",
})
export class OrderService {
  private apiUrl = "http://localhost:8080/api/v1"; // Điều chỉnh URL này theo server Spring Boot của bạn

  // Thêm BehaviorSubject để theo dõi thay đổi giỏ hàng
  private cartItemsSubject = new BehaviorSubject<CartItem[]>(
    this.getCartItems()
  );
  public cartItems$ = this.cartItemsSubject.asObservable();

  constructor(private http: HttpClient) {}

  // Lấy sản phẩm trong giỏ hàng (giả lập từ localStorage hoặc API)
  getCartItems(): CartItem[] {
    const storedCart = localStorage.getItem("cart");
    return storedCart ? JSON.parse(storedCart) : [];
  }

  // Lưu giỏ hàng vào localStorage
  saveCartItems(items: CartItem[]): void {
    localStorage.setItem("cart", JSON.stringify(items));
    this.cartItemsSubject.next(items);
  }

  // Tính tổng tiền giỏ hàng
  calculateTotal(items: CartItem[]): number {
    return items.reduce(
      (total, item) => total + item.product.price * item.quantity,
      0
    );
  }

  // Thêm sản phẩm vào giỏ hàng
  addToCart(product: any, quantity: number = 1): void {
    const cart = this.getCartItems();
    const existingItemIndex = cart.findIndex(
      (item) => item.product.id === product.id
    );

    if (existingItemIndex !== -1) {
      // Nếu sản phẩm đã có trong giỏ hàng, tăng số lượng
      cart[existingItemIndex].quantity += quantity;
    } else {
      // Nếu chưa có, thêm mới vào giỏ hàng
      cart.push({
        product: product,
        quantity: quantity,
      });
    }

    this.saveCartItems(cart);
  }

  // Cập nhật số lượng sản phẩm
  updateQuantity(productId: number, change: number): CartItem[] {
    const cart = this.getCartItems();
    const itemIndex = cart.findIndex((item) => item.product.id === productId);

    if (itemIndex !== -1) {
      const newQuantity = cart[itemIndex].quantity + change;

      if (newQuantity <= 0) {
        // Xóa sản phẩm khỏi giỏ hàng nếu số lượng = 0
        cart.splice(itemIndex, 1);
      } else {
        // Cập nhật số lượng mới
        cart[itemIndex].quantity = newQuantity;
      }

      this.saveCartItems(cart);
    }

    return cart;
  }

  // Xóa sản phẩm khỏi giỏ hàng
  removeFromCart(productId: number): void {
    const cart = this.getCartItems();
    const updatedCart = cart.filter((item) => item.product.id !== productId);
    this.saveCartItems(updatedCart);
  }

  // Xóa toàn bộ giỏ hàng
  clearCart(): void {
    localStorage.removeItem("cart");
    this.cartItemsSubject.next([]);
  }

  // Lấy số lượng sản phẩm trong giỏ hàng
  getCartItemCount(): number {
    return this.getCartItems().reduce(
      (count, item) => count + item.quantity,
      0
    );
  }

  // Gửi đơn hàng lên server
  createOrder(orderData: OrderRequest): Observable<OrderResponse> {
    return this.http.post<OrderResponse>(`${this.apiUrl}/orders`, orderData);
  }

  // Áp dụng mã giảm giá (có thể triển khai sau)
  applyPromoCode(code: string): Observable<{ discount: number }> {
    return this.http.post<{ discount: number }>(`${this.apiUrl}/promo/apply`, {
      code,
    });
  }
}
