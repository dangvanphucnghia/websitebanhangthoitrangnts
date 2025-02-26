import { Routes } from "@angular/router";
import { HomeComponent } from "./components/home/home.component";
import { LoginComponent } from "./components/login/login.component";
import { RegisterComponent } from "./components/register/register.component";
import { OrderComponent } from "./components/order/order.component";
import { OrderConfirmComponent } from "./components/order-confirm/order-confirm.component";

export const routes: Routes = [
  {
    path: "",
    component: HomeComponent,
  },
  {
    path: "register",
    component: RegisterComponent,
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
