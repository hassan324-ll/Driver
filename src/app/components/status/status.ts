import { Component } from '@angular/core';
import { Firebase } from '../../services/firebase';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { CommonModule } from '@angular/common';
import { Header } from '../header/header';
// Footer commented in template

@Component({
  selector: 'app-status',
  imports: [CommonModule, Header],
  templateUrl: './status.html',
  styleUrl: './status.css',
})
export class Status {
  userJobs: any[] = [];

  /**
   * Constructor: Injects Firebase service and loads jobs for the current user.
   */
  constructor(private firebase: Firebase) {
    this.loadUserJobs();
  }

  /**
   * Cancels a job by updating its status to 'cancelled' in Firestore.
   * Reloads the user's jobs after cancellation.
   * @param jobId - The ID of the job to cancel
   */
  async cancelJob(jobId: string) {
    if (!jobId || typeof jobId !== 'string') {
      console.error('Invalid jobId for cancellation:', jobId);
      return;
    }
    const db = getFirestore(this.firebase.app);
    const { updateDoc, doc } = await import('firebase/firestore');
    await updateDoc(doc(db, 'jobs', jobId), { status: 'cancelled' });
    this.loadUserJobs();
  }

  /**
   * Loads jobs for the currently authenticated user from Firestore.
   * Updates the userJobs array with the user's jobs.
   */
  async loadUserJobs() {
    const auth = getAuth();
    auth.onAuthStateChanged(async (user) => {
      if (user) {
        const db = getFirestore(this.firebase.app);
        const { getDocs, collection, query, where } = await import('firebase/firestore');
        const jobsQuery = query(collection(db, 'jobs'), where('userId', '==', user.uid));
        const jobsSnap = await getDocs(jobsQuery);
        this.userJobs = jobsSnap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      } else {
        this.userJobs = [];
      }
    });
  }
}
