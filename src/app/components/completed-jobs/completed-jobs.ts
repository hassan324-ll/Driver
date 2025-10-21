import { Component } from '@angular/core';
import { Firebase } from '../../services/firebase';
import { getFirestore } from 'firebase/firestore';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-completed-jobs',
  imports: [CommonModule],
  templateUrl: './completed-jobs.html',
  styleUrl: './completed-jobs.css',
})
export class CompletedJobs {
  jobs: any[] = [];

  /**
   * Constructor: Injects Firebase service and loads completed jobs on initialization.
   */
  constructor(private firebase: Firebase) {
    this.loadCompletedJobs();
  }

  /**
   * Loads all jobs with status 'completed' from Firestore and updates the jobs array.
   */
  async loadCompletedJobs() {
    const db = getFirestore(this.firebase.app);
    const { getDocs, collection, query, where } = await import('firebase/firestore');
    const jobsQuery = query(collection(db, 'jobs'), where('status', '==', 'completed'));
    const jobsSnap = await getDocs(jobsQuery);
    this.jobs = jobsSnap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  }
}
