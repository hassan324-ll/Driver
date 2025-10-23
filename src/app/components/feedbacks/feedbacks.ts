import { Component } from '@angular/core';
import { Firebase } from '../../services/firebase';
import { getFirestore } from 'firebase/firestore';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-feedbacks',
  imports: [CommonModule],
  templateUrl: './feedbacks.html',
  styleUrl: './feedbacks.css',
})
export class Feedbacks {
  reviews: any[] = [];
  loading = false;

  /**
   * Constructor: Injects Firebase service and loads reviews on initialization.
   */
  constructor(private firebase: Firebase) {
    this.loadReviews();
  }

  /**
   * Loads all reviews from Firestore and updates the reviews array.
   */
  async loadReviews() {
    this.loading = true;
    try {
      const db = getFirestore(this.firebase.app);
      const { getDocs, collection } = await import('firebase/firestore');
      const reviewsSnap = await getDocs(collection(db, 'reviews'));
      this.reviews = reviewsSnap.docs.map((doc) => doc.data());
    } catch (err) {
      console.error('Failed to load reviews', err);
      this.reviews = [];
    } finally {
      setTimeout(() => (this.loading = false), 250);
    }
  }
}
