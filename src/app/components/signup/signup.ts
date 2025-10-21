import { Component } from '@angular/core';
import { Firebase } from '../../services/firebase';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { RouterLink } from '@angular/router';
@Component({
  selector: 'app-signup',
  imports: [CommonModule, FormsModule, RouterModule, RouterLink],
  templateUrl: './signup.html',
  styleUrl: './signup.css',
})
export class Signup {
  customerName: string = '';
  email: string = '';
  phoneNumber: string = '';
  password: string = '';
  reEnterPassword: string = '';
  error: string = '';
  success: string = '';

  constructor(private firebase: Firebase, private router: Router) {}

  async onRegister() {
    this.error = '';
    this.success = '';
    if (this.password !== this.reEnterPassword) {
      this.error = 'Passwords do not match.';
      return;
    }
    try {
      await this.firebase.signupUser({
        name: this.customerName,
        email: this.email,
        phone: this.phoneNumber,
        password: this.password,
      });
      this.success = 'Account created successfully!';
      setTimeout(() => {
        this.router.navigate(['/account-setup']);
      }, 1200);
    } catch (err: any) {
      console.error('Signup error:', err);
      if (err.code) {
        switch (err.code) {
          case 'auth/email-already-in-use':
            this.error = 'This email is already registered.';
            break;
          case 'auth/invalid-email':
            this.error = 'Invalid email address.';
            break;
          case 'auth/weak-password':
            this.error = 'Password should be at least 6 characters.';
            break;
          default:
            this.error = err.message || 'Signup failed.';
        }
      } else {
        this.error = err.message || 'Signup failed.';
      }
    }
  }
}
