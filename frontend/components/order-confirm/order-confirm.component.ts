import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FooterComponent } from '../footer/footer.component'; // Import FooterComponent
import { HeaderComponent } from '../header/header.component';
@Component({
  selector: 'app-order-confirm',
  standalone: true,
  imports: [CommonModule,FooterComponent, HeaderComponent],
  templateUrl: './order-confirm.component.html',
  styleUrl: './order-confirm.component.scss'
})
export class OrderConfirmComponent {

}
