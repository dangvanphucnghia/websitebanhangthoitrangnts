import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { FooterComponent } from "../footer/footer.component";
import { HeaderComponent } from "../header/header.component";
import { ProductService } from "../../services/product.service";
import { CategoryService } from "../../services/category.service";
import { OrderService } from "../../services/order.service";
import { Product } from "../../responses/product.response";
import { Category } from "../../responses/category.reponse";
import { HttpClientModule } from "@angular/common/http";
import { RouterModule } from "@angular/router";

@Component({
  selector: "app-home",
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    HttpClientModule,
    FooterComponent,
    HeaderComponent,
    RouterModule,
  ],
  templateUrl: "./home.component.html",
  styleUrl: "./home.component.scss",
})
export class HomeComponent implements OnInit {
  products: Product[] = [];
  categories: Category[] = [];
  currentPage = 1;
  limit = 8;
  totalPages = 0;
  baseUrl = "http://localhost:8080/api/v1/products/images";

  searchKeyword: string = "";
  selectedCategoryId: number = 0;
  isLoading: boolean = false;
  isLoadingCategories: boolean = false;
  errorMessage: string = "";
  successMessage: string = "";

  constructor(
    private productService: ProductService,
    private categoryService: CategoryService,
    private orderService: OrderService
  ) {}

  ngOnInit() {
    this.loadCategories();
    this.loadProducts();
  }

  loadCategories() {
    this.isLoadingCategories = true;
    this.categoryService.getAllCategories().subscribe({
      next: (response) => {
        console.log("Categories loaded:", response);
        this.categories = response;
        this.isLoadingCategories = false;
      },
      error: (error) => {
        console.error("Error loading categories:", error);
        this.isLoadingCategories = false;
        this.errorMessage = "Không thể tải danh mục sản phẩm";
      },
      complete: () => {
        this.isLoadingCategories = false;
      },
    });
  }

  loadProducts() {
    this.isLoading = true;
    this.productService
      .getProducts(
        this.currentPage - 1,
        this.limit,
        this.searchKeyword,
        this.selectedCategoryId
      )
      .subscribe({
        next: (response) => {
          console.log("Products loaded:", response);
          this.products = response.products;
          this.totalPages = response.totalPages;
          this.isLoading = false;
        },
        error: (error) => {
          console.error("Error loading products:", error);
          this.isLoading = false;
          this.errorMessage = "Không thể tải sản phẩm";
        },
        complete: () => {
          this.isLoading = false;
        },
      });
  }

  onSearch() {
    this.currentPage = 1;
    this.loadProducts();
  }

  // Thêm debounce cho search
  private searchTimeout: any;
  onSearchInput() {
    if (this.searchTimeout) {
      clearTimeout(this.searchTimeout);
    }
    this.searchTimeout = setTimeout(() => {
      this.onSearch();
    }, 300);
  }

  onCategoryChange(categoryId: number) {
    this.selectedCategoryId = Number(categoryId);
    this.currentPage = 1;
    this.loadProducts();
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.loadProducts();
    }
  }

  prevPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.loadProducts();
    }
  }

  getImageUrl(thumbnail: string): string {
    return thumbnail
      ? `${this.baseUrl}/${thumbnail}`
      : "assets/placeholder.jpg";
  }

  onImageError(event: any) {
    event.target.src = "assets/placeholder.jpg";
  }

  // Thêm phương thức addToCart
  addToCart(product: Product): void {
    this.orderService.addToCart({
      id: product.id,
      name: product.name,
      image: this.getImageUrl(product.thumbnail),
      category: product.category?.name || "Không phân loại",
      price: product.price,
    });

    this.successMessage = `Đã thêm ${product.name} vào giỏ hàng`;

    // Ẩn thông báo sau 3 giây
    setTimeout(() => {
      this.successMessage = "";
    }, 3000);
  }

  // Thêm phương thức buyNow
  buyNow(product: Product): void {
    this.addToCart(product);
    // Chuyển hướng đến trang đặt hàng
    window.location.href = "/order";
  }

  // Thêm phương thức để format giá
  formatPrice(price: number): string {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  }

  // Thêm phương thức để kiểm tra trạng thái loading
  isPageLoading(): boolean {
    return this.isLoading || this.isLoadingCategories;
  }

  // Thêm phương thức để reset bộ lọc
  resetFilters() {
    this.searchKeyword = "";
    this.selectedCategoryId = 0;
    this.currentPage = 1;
    this.loadProducts();
  }

  // Xử lý lỗi chung
  handleError(error: any, message: string) {
    console.error(error);
    this.errorMessage = message;
    setTimeout(() => {
      this.errorMessage = "";
    }, 3000);
  }

  // Scroll to top khi chuyển trang
  scrollToTop() {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  // Thêm phương thức để theo dõi trạng thái loading cho từng sản phẩm
  loadingStates: { [key: number]: boolean } = {};
  setProductLoading(productId: number, loading: boolean) {
    this.loadingStates[productId] = loading;
  }

  isProductLoading(productId: number): boolean {
    return this.loadingStates[productId] || false;
  }
}
