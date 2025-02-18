import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { HeaderComponent } from '../header/header.component';
import { FooterComponent } from '../footer/footer.component';
import { UserService } from '../../services/user.service';
import { TokenService } from '../../services/token.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    HeaderComponent,
    FooterComponent,
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  phoneNumber = '';
  password = '';
  loading = false;
  error = '';
  roles: string[] = ['USER', 'ADMIN'];
  selectedRole = 'USER';

  constructor(
    private userService: UserService,
    private tokenService: TokenService,
    private router: Router
  ) {}

  onPhoneNumberChange() {
    // Xử lý sự kiện thay đổi số điện thoại
  }

  login() {
    this.loading = true;
    this.error = '';

    const loginData = {
      phone_number: this.phoneNumber,
      password: this.password,
      role: this.selectedRole,
    };

    this.userService.login(loginData).subscribe({
      next: (response) => {
        alert('Đăng nhập thành công!');
        this.tokenService.setToken(response.token);
        this.tokenService.setRole(response.role); // Lưu role vào TokenService
        this.router.navigate(['/']);
      },
      error: (error) => {
        alert('Đăng nhập không thành công!');
        this.error = error.error?.message || 'Đăng nhập thất bại';
        this.loading = false;
      },
    });
  }
}
