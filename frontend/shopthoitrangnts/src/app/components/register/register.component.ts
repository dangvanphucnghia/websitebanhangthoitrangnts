import { UserService } from '../../services/user.service';
import { RouterModule } from '@angular/router';
import { Component, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FooterComponent } from '../footer/footer.component'; // Import FooterComponent
import { HeaderComponent } from '../header/header.component';
import { NgForm } from '@angular/forms';

import { Router } from '@angular/router';
import { RegisterDTO } from '../../dtos/user/register.dto';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    FooterComponent,
    HeaderComponent,
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
})
export class RegisterComponent {
  @ViewChild('registerForm') registerForm!: NgForm;
  phoneNumber: string;
  password: string;
  retypePassword: string;
  fullname: string;
  address: string;
  isAccepted: boolean;
  dateOfBirth: Date;
  constructor(private route: Router, private UserService: UserService) {
    this.phoneNumber = '';
    this.password = '';
    this.retypePassword = '';
    this.fullname = '';
    this.address = '';
    this.isAccepted = true;
    this.dateOfBirth = new Date();
    this.dateOfBirth.setUTCFullYear(this.dateOfBirth.getFullYear() - 18);
  }

  onPhoneNumberChange() {
    console.log('Phone typed: ${this.phoneNumber}');
  }
  register() {
    // alert('Bạn đã nhấn đăng ký');
    const apiUrl = 'http://localhost:8080/api/v1/users/register';
    const registerDTO: RegisterDTO = {
      fullname: this.fullname,
      phone_number: this.phoneNumber,
      address: this.address,
      password: this.password,
      retype_password: this.retypePassword,
      date_of_birth: this.dateOfBirth,
      facebook_account_id: 0,
      google_account_id: 0,
      role_id: 1,
    };
    this.UserService.register(registerDTO).subscribe({
      next: (response: any) => {
        alert('Đăng ký thành công!');
        this.route.navigate(['/login']);
      },
      error: (error: any) => {
        alert(
          'Đăng ký không thành công: ' + error.error?.message || 'Có lỗi xảy ra'
        );
      },
    });
  }
  checkPasswordsMatch() {
    if (this.password !== this.retypePassword) {
      this.registerForm.form.controls['retypePassword'].setErrors({
        passwordMismatch: true,
      });
    } else {
      this.registerForm.form.controls['retypePassword'].setErrors(null);
    }
  }

  checkAge() {
    if (this.dateOfBirth) {
      const today = new Date();
      const birthDate = new Date(this.dateOfBirth);
      let age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      if (
        monthDiff < 0 ||
        (monthDiff === 0 && today.getDate() < birthDate.getDate())
      ) {
        age--;
      }

      if (age < 16) {
        this.registerForm.form.controls['dateOfBirth'].setErrors({
          invaliAge: true,
        });
      } else {
        this.registerForm.form.controls['dateOfBirth'].setErrors(null);
      }
    }
  }
}
