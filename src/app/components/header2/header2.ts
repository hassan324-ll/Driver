import { Component, Output, EventEmitter, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { getFirestore, collection, onSnapshot } from 'firebase/firestore';
import { Firebase } from '../../services/firebase';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-header2',
  imports: [CommonModule, RouterLink],
  templateUrl: './header2.html',
  styleUrl: './header2.css',
})
export class Header2 implements OnInit, OnDestroy {
  @Output() sidebarTrigger = new EventEmitter<void>();
  showNotifications = false;
  notificationCount = 0;
  notifications: Array<{ userName: string; action: string; time: string }> = [];
  showProfileDropdown = false;
  userName: string = 'Admin'; // Replace with actual user name if available
  profileImage: string = 'assets/profile.jpeg'; // Replace with actual image path if available
  isDarkMode: boolean = false;
  private unsubJobs: any;
  private unsubReviews: any;
  private pendingNotifications: Array<{
    userName: string;
    action: string;
    time: string;
    createdAt?: string;
  }> = [];
  private lastReloadTime: number = 0;

  constructor(private firebase: Firebase) {}

  getTimeAgo(dateStr: string | undefined): string {
    if (!dateStr) return '';
    const now = new Date();
    const date = new Date(dateStr);
    const diffMs = now.getTime() - date.getTime();
    const diffSec = Math.floor(diffMs / 1000);
    if (diffSec < 60) return `${diffSec} sec ago`;
    const diffMin = Math.floor(diffSec / 60);
    if (diffMin < 60) return `${diffMin} min ago`;
    const diffHr = Math.floor(diffMin / 60);
    if (diffHr < 24) return `${diffHr} hour${diffHr > 1 ? 's' : ''} ago`;
    const diffDay = Math.floor(diffHr / 24);
    return `${diffDay} day${diffDay > 1 ? 's' : ''} ago`;
  }

  ngOnInit() {
    // Use a small delay to ensure lastReloadTime is after Firestore listeners are set up
    // setTimeout(() => {
    //   this.lastReloadTime = Date.now();
    // }, 500);
    const db = getFirestore(this.firebase.app);
    // Listen for job bookings and cancellations
    this.unsubJobs = onSnapshot(collection(db, 'jobs'), (snapshot) => {
      snapshot.docChanges().forEach((change) => {
        const data = change.doc.data();
        const createdAt = data['createdAt'] || undefined;
        const createdAtMs = createdAt ? new Date(createdAt).getTime() : 0;
        // Only show notifications for new jobs (added after reload)
        if (change.type === 'added' && createdAtMs > this.lastReloadTime) {
          this.pendingNotifications = [
            {
              userName: data['customerName'] || 'User',
              action: 'booked a job',
              time: this.getTimeAgo(createdAt),
              createdAt,
            },
            ...this.pendingNotifications,
          ].slice(0, 10);
          this.notificationCount = this.pendingNotifications.length;
          if (this.showNotifications) {
            this.notifications = [...this.pendingNotifications];
          }
        } else if (
          change.type === 'modified' &&
          data['status'] === 'cancelled' &&
          createdAtMs > this.lastReloadTime
        ) {
          this.pendingNotifications = [
            {
              userName: data['customerName'] || 'User',
              action: 'cancelled a job',
              time: this.getTimeAgo(createdAt),
              createdAt,
            },
            ...this.pendingNotifications,
          ].slice(0, 10);
          this.notificationCount = this.pendingNotifications.length;
          if (this.showNotifications) {
            this.notifications = [...this.pendingNotifications];
          }
        } else if (
          change.type === 'modified' &&
          data['status'] === 'completed' &&
          createdAtMs > this.lastReloadTime
        ) {
          this.pendingNotifications = [
            {
              userName: data['customerName'] || 'User',
              action: 'completed a job',
              time: this.getTimeAgo(createdAt),
              createdAt,
            },
            ...this.pendingNotifications,
          ].slice(0, 10);
          this.notificationCount = this.pendingNotifications.length;
          if (this.showNotifications) {
            this.notifications = [...this.pendingNotifications];
          }
        }
      });
    });
    // Listen for reviews
    this.unsubReviews = onSnapshot(collection(db, 'reviews'), (snapshot) => {
      snapshot.docChanges().forEach((change) => {
        if (change.type === 'added') {
          const data = change.doc.data();
          const createdAt = data['createdAt'] || undefined;
          const createdAtMs = createdAt ? new Date(createdAt).getTime() : 0;
          // Only show notifications for new reviews (added after reload)
          if (createdAtMs > this.lastReloadTime) {
            this.pendingNotifications = [
              {
                userName: data['userName'] || 'User',
                action: 'gave a review',
                time: this.getTimeAgo(createdAt),
                createdAt,
              },
              ...this.pendingNotifications,
            ].slice(0, 10);
            this.notificationCount = this.pendingNotifications.length;
            if (this.showNotifications) {
              this.notifications = [...this.pendingNotifications];
            }
          }
        }
      });
    });
  }

  toggleProfileDropdown() {
    this.showProfileDropdown = !this.showProfileDropdown;
  }

  closeProfileDropdown() {
    this.showProfileDropdown = false;
  }

  signOut() {
    import('firebase/auth').then(({ getAuth, signOut }) => {
      const auth = getAuth();
      signOut(auth).then(() => {
        sessionStorage.removeItem('profilePicUrl');
        sessionStorage.removeItem('profileName');
        window.location.href = '/login';
      });
    });
    // Implement sign out logic here (e.g., Firebase sign out)
  }

  toggleNotifications() {
    this.showNotifications = !this.showNotifications;
    if (this.showNotifications) {
      this.notifications = [...this.pendingNotifications];
    } else {
      this.notifications = [];
      this.notificationCount = 0;
      this.pendingNotifications = [];
    }
  }

  ngOnDestroy() {
    if (this.unsubJobs) this.unsubJobs();
    if (this.unsubReviews) this.unsubReviews();
  }
}
