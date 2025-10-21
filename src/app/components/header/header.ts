import { CommonModule } from '@angular/common';
import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { RouterLink, Router, NavigationStart } from '@angular/router';
import { Firebase } from '../../services/firebase';
import { getAuth } from 'firebase/auth';

@Component({
  selector: 'app-header',
  imports: [RouterLink, CommonModule],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header implements OnInit, OnDestroy {
  @Input() hideIcons: boolean = false;
  sidebarOpen = false;
  showProfileDropdown = false;
  notificationCount = 0;
  profilePicUrl: string = './profile.jpeg';
  profileName: string = '';

  private routerSub: any;

  constructor(private firebase: Firebase, private router: Router) {}

  async ngOnInit() {
    // Try to load from sessionStorage first
    const cachedPic = sessionStorage.getItem('profilePicUrl');
    const cachedName = sessionStorage.getItem('profileName');
    if (cachedPic && cachedName) {
      this.profilePicUrl = cachedPic;
      this.profileName = cachedName;
      return;
    }
    const auth = getAuth();
    await new Promise<void>((resolve) => {
      const unsub = auth.onAuthStateChanged(() => {
        unsub();
        resolve();
      });
    });
    const user = auth.currentUser;
    if (user) {
      const db = (await import('firebase/firestore')).getFirestore(this.firebase.app);
      const docSnap = await (
        await import('firebase/firestore')
      ).getDoc((await import('firebase/firestore')).doc(db, 'user_data', user.uid));
      if (docSnap.exists()) {
        const data = docSnap.data();
        this.profilePicUrl =
          data['profilePicUrl'] && data['profilePicUrl'].length > 0
            ? data['profilePicUrl']
            : './profile.jpeg';
        this.profileName =
          (data['firstName'] || '') + (data['lastName'] ? ' ' + data['lastName'] : '');
        sessionStorage.setItem('profilePicUrl', this.profilePicUrl);
        sessionStorage.setItem('profileName', this.profileName);
      }
    }

    // Close profile dropdown when navigation starts (so clicking routerLink closes it)
    try {
      this.routerSub = this.router.events.subscribe((e: any) => {
        if (e instanceof NavigationStart) {
          this.showProfileDropdown = false;
        }
      });
    } catch (err) {
      // Router may not be available in some environments; fail silently
    }
  }

  toggleSidebar() {
    this.sidebarOpen = !this.sidebarOpen;
  }

  ngOnDestroy(): void {
    if (this.routerSub && this.routerSub.unsubscribe) {
      this.routerSub.unsubscribe();
    }
  }

  closeProfileDropdown() {
    this.showProfileDropdown = false;
  }

  logout() {
    // Implement logout logic here
    // For example, using Firebase Auth:
    import('firebase/auth').then(({ getAuth, signOut }) => {
      const auth = getAuth();
      signOut(auth).then(() => {
        sessionStorage.removeItem('profilePicUrl');
        sessionStorage.removeItem('profileName');
        window.location.href = '/login';
      });
    });
  }
  logoClick() {
    window.location.href = '/home';
  }
}
