import { Routes } from "@angular/router";
import { HomeComponent } from "./components/home/home.component";
import { LoginComponent } from "./components/login/login.component";
import { RegisterComponent } from "./components/register/register.component";
import { OrderComponent } from "./components/order/order.component";
import { OrderConfirmComponent } from "./components/order-confirm/order-confirm.component";

export const routes: Routes = [
  {
    path: "", // thêm path riêng cho home
    component: HomeComponent,
  },
  {
    path: "register", // empty path cho trang mặc định
    component: RegisterComponent, // Register là trang mặc định
  },

  {
    path: "login",
    component: LoginComponent,
  },
  {
    path: "order",
    component: OrderComponent,
  },
  {
    path: "order/order-confirm",
    component: OrderConfirmComponent,
  },
  {
    path: "**", // wildcard route cho các URL không hợp lệ
    redirectTo: "", // redirect về trang mặc định
  },
];
