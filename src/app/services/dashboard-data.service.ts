import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class DashboardDataService {
  private activeJobsCount: number | null = null;
  private cancelledJobsCount: number | null = null;
  private completedJobsCount: number | null = null;
  private reviewsCount: number | null = null;
  private recentJobs: Array<any> | null = null;

  setCounts(
    active: number,
    cancelled: number,
    completed: number,
    reviews: number,
    recentJobs?: Array<any>
  ) {
    this.activeJobsCount = active;
    this.cancelledJobsCount = cancelled;
    this.completedJobsCount = completed;
    this.reviewsCount = reviews;
    if (recentJobs) {
      this.recentJobs = recentJobs;
    }
  }

  getCounts() {
    return {
      active: this.activeJobsCount,
      cancelled: this.cancelledJobsCount,
      completed: this.completedJobsCount,
      feedbacks: this.reviewsCount,
      recentJobs: this.recentJobs,
    };
  }

  hasCounts(): boolean {
    return (
      this.activeJobsCount !== null &&
      this.cancelledJobsCount !== null &&
      this.completedJobsCount !== null &&
      this.reviewsCount !== null &&
      this.recentJobs !== null
    );
  }
}
