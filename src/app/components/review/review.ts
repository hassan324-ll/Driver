import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Firebase } from '../../services/firebase';
import { getAuth } from 'firebase/auth';
// Footer is commented out in template; keep Header only
import { Header } from '../header/header';
import { Router } from '@angular/router';

import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-review',
  imports: [CommonModule, FormsModule, Header],
  templateUrl: './review.html',
  styleUrl: './review.css',
})
export class Review {
  reviewerName: string = '';
  rating: string = '';
  comments: string = '';
  errorMessage: string = '';
  successMessage: string = '';
  errors: any = {};

  /**
   * Constructor: Injects Firebase service and Angular Router.
   */
  constructor(private firebase: Firebase, private router: Router) {}

  /**
   * Handles review form submission.
   * Validates input, saves review to Firestore, and resets the form.
   */
  async onSubmitReview() {
    this.errors = {};
    if (!this.reviewerName.trim()) this.errors.reviewerName = 'Name is required.';
    if (!this.rating.trim()) this.errors.rating = 'Rating is required.';
    if (!this.comments.trim()) this.errors.comments = 'Comments are required.';
    if (Object.keys(this.errors).length > 0) {
      return;
    }
    this.errorMessage = '';
    const auth = getAuth();
    const user = auth.currentUser;
    const reviewData = {
      reviewerName: this.reviewerName,
      rating: this.rating,
      comments: this.comments,
      userId: user ? user.uid : null,
      createdAt: new Date().toISOString(),
    };
    // Save to Firestore (collection: reviews)
    const db = this.firebase.app ? this.firebase.app : null;
    if (db) {
      const { getFirestore, collection, addDoc } = await import('firebase/firestore');
      const firestore = getFirestore(db);
      await addDoc(collection(firestore, 'reviews'), reviewData);
      this.successMessage = 'Review submitted successfully!';
      this.reviewerName = '';
      this.rating = '';
      this.comments = '';
      setTimeout(() => {
        this.successMessage = '';
      }, 2000);
    }
  }
}
