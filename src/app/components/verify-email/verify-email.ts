import { Component } from '@angular/core';
import { Firebase } from '../../services/firebase';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-verify-email',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './verify-email.html',
  styleUrl: './verify-email.css',
})
export class VerifyEmail {
  message: string =
    'A verification link has been sent to your email. Please verify your email to continue.Please check you spam folder.';
  error: string = '';
  loading: boolean = false;

  constructor(private firebase: Firebase, private router: Router) {}

  async checkVerification() {
    this.error = '';
    this.loading = true;
    const { getAuth } = await import('firebase/auth');
    const auth = getAuth();
    await auth.currentUser?.reload();
    if (auth.currentUser?.emailVerified) {
      this.router.navigate(['/account-setup']);
    } else {
      this.error =
        'Your email is not verified yet. Please check your inbox and click the verification link.';
    }
    this.loading = false;
  }
}
