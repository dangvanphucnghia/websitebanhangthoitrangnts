import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FooterComponent } from '../footer/footer.component'; // Import FooterComponent
import { HeaderComponent } from '../header/header.component';
@Component({
  selector: 'app-detail-product',
  standalone: true,
  imports: [CommonModule,FooterComponent, HeaderComponent],
  templateUrl: './detail-product.component.html',
  styleUrl: './detail-product.component.scss'
})
export class DetailProductComponent {

}
