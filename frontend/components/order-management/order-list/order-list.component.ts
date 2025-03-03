import { Component, OnInit } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import { FormsModule } from "@angular/forms";

interface Order {
  id: number;
  orderCode?: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  orderDate: string;
  status: string;
  totalMoney: number;
  paymentMethod: string;
  shippingMethod: string;
  trackingNumber?: string;
}

interface OrdersResponse {
  content: Order[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}

@Component({
  selector: "app-order-list",
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: "./order-list.component.html",
  styleUrls: ["./order-list.component.scss"],
})
export class OrderListComponent implements OnInit {
  orders: Order[] = [];
  loading: boolean = false;
  error: string | null = null;

  // Bộ lọc
  searchTerm: string = "";
  status: string = "";
  paymentMethod: string = "";
  startDate: string = "";
  endDate: string = "";

  // Phân trang
  currentPage: number = 0;
  pageSize: number = 10;
  totalItems: number = 0;
  totalPages: number = 0;

  // API URL
  private apiUrl = "http://localhost:8080/api/v1";

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadOrders();
  }

  loadOrders(): void {
    this.loading = true;
    this.error = null;

    let url = `${this.apiUrl}?page=${this.currentPage}&size=${this.pageSize}`;

    if (this.searchTerm) {
      url += `&search=${this.searchTerm}`;
    }

    if (this.status) {
      url += `&status=${this.status}`;
    }

    if (this.paymentMethod) {
      url += `&paymentMethod=${this.paymentMethod}`;
    }

    if (this.startDate) {
      url += `&startDate=${this.startDate}`;
    }

    if (this.endDate) {
      url += `&endDate=${this.endDate}`;
    }

    // Lấy token từ localStorage (giả sử bạn đã lưu token ở đó)
    const token = localStorage.getItem("auth_token");

    const headers = new HttpHeaders({
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    });

    this.http.get<OrdersResponse>(url, { headers }).subscribe({
      next: (response) => {
        console.log("API Response:", response);
        this.orders = response.content || [];
        this.totalItems = response.totalElements || 0;
        this.totalPages = response.totalPages || 0;
        this.currentPage = response.number || 0;
        this.loading = false;
      },
      error: (err) => {
        console.error("Error loading orders:", err);
        this.error = "Không thể tải dữ liệu đơn hàng. Vui lòng thử lại sau.";
        this.loading = false;
      },
    });
  }

  onSearch(): void {
    this.currentPage = 0;
    this.loadOrders();
  }

  applyFilter(): void {
    this.currentPage = 0;
    this.loadOrders();
  }

  resetFilter(): void {
    this.searchTerm = "";
    this.status = "";
    this.paymentMethod = "";
    this.startDate = "";
    this.endDate = "";
    this.currentPage = 0;
    this.loadOrders();
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.loadOrders();
  }

  createNewOrder(): void {
    // Chuyển hướng đến trang tạo đơn hàng mới
    window.location.href = "/admin/order/create";
  }

  viewOrderDetail(orderId: number): void {
    window.location.href = `/admin/order/${orderId}`;
  }

  getStatusName(status: string): string {
    switch (status) {
      case "PENDING":
        return "Chờ xác nhận";
      case "PROCESSING":
        return "Đang xử lý";
      case "SHIPPED":
        return "Đang giao";
      case "DELIVERED":
        return "Đã giao";
      case "CANCELLED":
        return "Đã hủy";
      default:
        return status;
    }
  }

  getStatusClass(status: string): string {
    switch (status) {
      case "PENDING":
        return "badge bg-warning";
      case "PROCESSING":
        return "badge bg-info";
      case "SHIPPED":
        return "badge bg-primary";
      case "DELIVERED":
        return "badge bg-success";
      case "CANCELLED":
        return "badge bg-danger";
      default:
        return "badge bg-secondary";
    }
  }
}
