import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FooterComponent } from "../footer/footer.component"; // Import FooterComponent
import { HeaderComponent } from "../header/header.component";
import { RouterModule, Router } from "@angular/router";
import { ReactiveFormsModule } from "@angular/forms";
import { CartItem } from "../../dtos/order/cart.item";
import { FormGroup } from "@angular/forms";
import { FormBuilder } from "@angular/forms";
import { OrderRequest } from "../../dtos/order/order.requpest";
import { OrderService } from "../../services/order.service";
import { HttpClientModule } from "@angular/common/http";
import { Validators } from "@angular/forms";
@Component({
  selector: "app-order",
  standalone: true,
  imports: [
    CommonModule,
    FooterComponent,
    HeaderComponent,
    RouterModule,
    ReactiveFormsModule,
    HttpClientModule,
  ],
  templateUrl: "./order.component.html",
  styleUrl: "./order.component.scss",
})
export class OrderComponent implements OnInit {
  orderForm: FormGroup;
  cartItems: CartItem[] = [];
  totalAmount: number = 0;
  discount: number = 0;
  finalAmount: number = 0;
  promoCode: string = "";
  loading: boolean = false;
  errorMessage: string = "";

  constructor(
    private fb: FormBuilder,
    private orderService: OrderService,
    private router: Router
  ) {
    this.orderForm = this.fb.group({
      fullName: ["", [Validators.required, Validators.minLength(3)]],
      email: ["", [Validators.required, Validators.email]],
      phoneNumber: [
        "",
        [Validators.required, Validators.pattern(/^[0-9]{9,11}$/)],
      ],
      address: ["", [Validators.required, Validators.minLength(10)]],
      note: [""],
    });
  }

  ngOnInit(): void {
    this.loadCartItems();
  }

  loadCartItems(): void {
    this.cartItems = this.orderService.getCartItems();
    this.calculateTotals();
  }

  updateQuantity(productId: number, change: number): void {
    this.cartItems = this.orderService.updateQuantity(productId, change);
    this.calculateTotals();
  }

  calculateTotals(): void {
    this.totalAmount = this.orderService.calculateTotal(this.cartItems);
    // Giả sử đã có giảm giá 50.000đ (có thể thay bằng API trong thực tế)
    this.discount = 50000;
    this.finalAmount = this.totalAmount - this.discount;
  }

  applyPromoCode(): void {
    if (!this.promoCode.trim()) {
      this.errorMessage = "Vui lòng nhập mã giảm giá";
      return;
    }

    this.loading = true;
    this.orderService.applyPromoCode(this.promoCode).subscribe({
      next: (response) => {
        this.discount = response.discount;
        this.finalAmount = this.totalAmount - this.discount;
        this.loading = false;
        this.errorMessage = "";
      },
      error: (error) => {
        this.errorMessage = "Mã giảm giá không hợp lệ";
        this.loading = false;
      },
    });
  }

  submitOrder(): void {
    if (this.orderForm.invalid) {
      // Đánh dấu tất cả các trường đã chạm vào để hiển thị lỗi
      Object.keys(this.orderForm.controls).forEach((key) => {
        const control = this.orderForm.get(key);
        control?.markAsTouched();
      });
      return;
    }

    if (this.cartItems.length === 0) {
      this.errorMessage = "Giỏ hàng của bạn đang trống";
      return;
    }

    this.loading = true;

    // Tạo dữ liệu đơn hàng từ form và giỏ hàng
    const orderData: OrderRequest = {
      ...this.orderForm.value,
      totalMoney: this.finalAmount,
      shippingMethod: "Standard", // Mặc định
      shippingAddress: this.orderForm.value.address,
      paymentMethod: "COD", // Mặc định thanh toán khi nhận hàng
      orderDetails: this.cartItems.map((item) => ({
        productId: item.product.id,
        quantity: item.quantity,
        price: item.product.price,
      })),
    };

    this.orderService.createOrder(orderData).subscribe({
      next: (response) => {
        // Xóa giỏ hàng sau khi đặt hàng thành công
        localStorage.removeItem("cart");

        // Chuyển hướng đến trang xác nhận đơn hàng
        this.router.navigate(["/order/order-confirm"], {
          state: { orderId: response.id },
        });

        this.loading = false;
      },
      error: (error) => {
        this.errorMessage = "Có lỗi xảy ra khi đặt hàng. Vui lòng thử lại sau.";
        this.loading = false;
      },
    });
  }

  // Helper methods for form validation
  get formControls() {
    return this.orderForm.controls;
  }

  hasError(controlName: string, errorType: string): boolean {
    const control = this.orderForm.get(controlName);
    return (
      ((control?.touched || control?.dirty) && control?.hasError(errorType)) ||
      false
    );
  }
}
