import { Component } from '@angular/core';
import { Firebase } from '../../services/firebase';
import { getFirestore } from 'firebase/firestore';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-cancelled-jobs',
  imports: [CommonModule],
  templateUrl: './cancelled-jobs.html',
  styleUrl: './cancelled-jobs.css',
})
export class CancelledJobs {
  jobs: any[] = [];
  loading = false;

  /**
   * Constructor: Injects Firebase service and loads cancelled jobs on initialization.
   */
  constructor(private firebase: Firebase) {
    this.loadCancelledJobs();
  }

  /**
   * Loads all jobs with status 'cancelled' from Firestore and updates the jobs array.
   */
  async loadCancelledJobs() {
    this.loading = true;
    try {
      const db = getFirestore(this.firebase.app);
      const { getDocs, collection, query, where } = await import('firebase/firestore');
      const jobsQuery = query(collection(db, 'jobs'), where('status', '==', 'cancelled'));
      const jobsSnap = await getDocs(jobsQuery);
      this.jobs = jobsSnap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    } catch (err) {
      console.error('Failed to load cancelled jobs', err);
      this.jobs = [];
    } finally {
      setTimeout(() => (this.loading = false), 250);
    }
  }
}
