import { Component } from '@angular/core';
import { Firebase } from '../../services/firebase';
import { getFirestore } from 'firebase/firestore';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-active-jobs',
  imports: [CommonModule],
  templateUrl: './active-jobs.html',
  styleUrl: './active-jobs.css',
})
export class ActiveJobs {
  jobs: any[] = [];

  // Modal state for image preview
  showImageModal: boolean = false;
  modalImageUrl: string = '';

  constructor(private firebase: Firebase) {
    this.loadActiveJobs();
  }

  //load active jobs from firestore and show it in template
  async loadActiveJobs() {
    const db = getFirestore(this.firebase.app);
    const { getDocs, collection, query, where } = await import('firebase/firestore');
    const jobsQuery = query(collection(db, 'jobs'), where('status', '==', 'pending'));
    const jobsSnap = await getDocs(jobsQuery);
    this.jobs = jobsSnap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  }

  //update job status to completed or cancelled
  async updateJobStatus(jobId: string, status: string) {
    const db = getFirestore(this.firebase.app);
    const { updateDoc, doc } = await import('firebase/firestore');
    await updateDoc(doc(db, 'jobs', jobId), { status });
    this.loadActiveJobs();
  }

  // Modal open/close methods
  openImageModal(imageUrl: string) {
    this.modalImageUrl = imageUrl;
    this.showImageModal = true;
  }
  closeImageModal() {
    this.showImageModal = false;
    this.modalImageUrl = '';
  }
}
