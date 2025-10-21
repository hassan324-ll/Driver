import { Component } from '@angular/core';
import { getAuth } from 'firebase/auth';
import { getFirestore, doc, getDoc, getDocs, collection } from 'firebase/firestore';
import { Router } from '@angular/router';

import { Firebase } from '../../services/firebase';
import { CommonModule } from '@angular/common';
import { ChangeDetectorRef } from '@angular/core';
import { DashboardDataService } from '../../services/dashboard-data.service';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.html',
  styleUrl: './admin-dashboard.css',
  imports: [CommonModule],
})
export class AdminDashboard {
  activeJobsCount: number = 0;
  cancelledJobsCount: number = 0;
  completedJobsCount: number = 0;
  reviewsCount: number = 0;
  recentJobs: Array<any> = [];

  sidebarOpen: boolean = false;
  isAdmin: boolean = false;
  constructor(
    private firebase: Firebase,
    private router: Router,
    private cdr: ChangeDetectorRef,
    private dashboardData: DashboardDataService
  ) {}
  logout() {
    import('firebase/auth').then(({ getAuth, signOut }) => {
      const auth = getAuth();
      signOut(auth).then(() => {
        window.location.href = '/login';
      });
    });
  }

  async ngOnInit() {
    const cached = this.dashboardData.getCounts();
    if (this.dashboardData.hasCounts()) {
      this.activeJobsCount = cached.active!;
      this.cancelledJobsCount = cached.cancelled!;
      this.completedJobsCount = cached.completed!;
      this.reviewsCount = cached.feedbacks!;
      this.recentJobs = cached.recentJobs || [];
      this.cdr.detectChanges();
      return;
    }
    const auth = getAuth();
    auth.onAuthStateChanged(async (user) => {
      if (user) {
        const db = getFirestore(this.firebase.app);
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (userDoc.exists() && userDoc.data()['role'] === 'admin') {
          this.isAdmin = true;
          // Fetch all jobs
          const jobsSnap = await getDocs(collection(db, 'jobs'));
          const jobs = jobsSnap.docs.map((doc: any) => {
            const data = doc.data();
            return {
              customerName: data.customerName || '',
              carName: data.carName || '',
              bookingDate: data.bookingDate || '',
              status: data.status || '',
              type: 'job',
            };
          });
          this.activeJobsCount = jobs.filter((j: any) => j.status === 'pending').length;
          this.cancelledJobsCount = jobs.filter((j: any) => j.status === 'cancelled').length;
          this.completedJobsCount = jobs.filter((j: any) => j.status === 'completed').length;
          // Fetch reviews
          const reviewsSnap = await getDocs(collection(db, 'reviews'));
          const reviews = reviewsSnap.docs.map((doc: any) => {
            const data = doc.data();
            return {
              customerName: data.customerName || '',
              carName: data.carName || '',
              bookingDate: data.date || '',
              status: 'review',
              type: 'review',
            };
          });
          this.reviewsCount = reviewsSnap.size;
          // Merge jobs and reviews for recentJobs
          this.recentJobs = [
            ...jobs.map((j) => ({ ...j })),
            ...reviews.map((r) => ({ ...r })),
          ].sort((a, b) => {
            // Sort by bookingDate descending (newest first)
            return new Date(b.bookingDate).getTime() - new Date(a.bookingDate).getTime();
          });
          // Cache the counts and recentJobs
          this.dashboardData.setCounts(
            this.activeJobsCount,
            this.cancelledJobsCount,
            this.completedJobsCount,
            this.reviewsCount,
            this.recentJobs
          );

          this.cdr.detectChanges();
        } else {
          this.router.navigate(['/home']);
        }
      } else {
        this.router.navigate(['/home']);
      }
    });
  }
}
