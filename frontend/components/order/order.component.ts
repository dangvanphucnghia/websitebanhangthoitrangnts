import { Component } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FooterComponent } from "../footer/footer.component"; // Import FooterComponent
import { HeaderComponent } from "../header/header.component";
import { RouterModule } from "@angular/router";
@Component({
  selector: "app-order",
  standalone: true,
  imports: [CommonModule, FooterComponent, HeaderComponent, RouterModule],
  templateUrl: "./order.component.html",
  styleUrl: "./order.component.scss",
})
export class OrderComponent {}
