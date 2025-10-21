import { Component } from '@angular/core';
import { Firebase } from '../../services/firebase';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [CommonModule, FormsModule, RouterModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  email: string = '';
  password: string = '';
  error: string = '';

  // Constructor: Injects Firebase service and Angular Router
  constructor(private firebase: Firebase, private router: Router) {}

  /**
   * Handles the login form submission.
   * Authenticates the user with Firebase, checks their role, and navigates accordingly.
   */
  async onSubmit() {
    this.error = '';
    try {
      // Attempt to log in the user with the provided email and password
      await this.firebase.loginUser(this.email, this.password);

      // Dynamically import Firebase Auth and Firestore modules
      const { getAuth } = await import('firebase/auth');
      const { getFirestore, doc, getDoc } = await import('firebase/firestore');
      const auth = getAuth();
      const user = auth.currentUser;

      // If user is authenticated, check their role in Firestore
      if (user) {
        const db = getFirestore(this.firebase.app);
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        // If user is admin, navigate to admin dashboard; otherwise, go to home
        if (userDoc.exists() && userDoc.data()['role'] === 'admin') {
          this.router.navigate(['/admin-layout']);
        } else {
          this.router.navigate(['/home']);
        }
      } else {
        // If no user is authenticated, navigate to home
        this.router.navigate(['/home']);
      }
    } catch (err: any) {
      // Handle authentication errors and display appropriate messages
      if (
        err.code === 'auth/user-not-found' ||
        err.code === 'auth/wrong-password' ||
        err.code === 'auth/invalid-credential'
      ) {
        this.error = 'Invalid credentials. Please try again.';
      } else {
        this.error = 'Login failed. Please try again.';
      }
    }
  }
}
