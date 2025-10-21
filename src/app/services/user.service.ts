import { Injectable } from '@angular/core';
import { getAuth } from 'firebase/auth';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import { Firebase } from './firebase';

@Injectable({ providedIn: 'root' })
export class UserService {
  private userName: string = '';
  private userUid: string = '';
  private userNamePromise: Promise<string> | null = null;

  constructor(private firebase: Firebase) {
    // Try to load from sessionStorage on service creation
    const cachedName = sessionStorage.getItem('userName');
    const cachedUid = sessionStorage.getItem('userUid');
    if (cachedName && cachedUid) {
      this.userName = cachedName;
      this.userUid = cachedUid;
    }
  }

  getUserName(): Promise<string> {
    const auth = getAuth();
    const currentUid = auth.currentUser?.uid || '';
    // If cached UID matches current user, use cached name
    if (this.userName && this.userUid === currentUid && this.userName !== '') {
      return Promise.resolve(this.userName);
    }
    if (this.userNamePromise) {
      return this.userNamePromise;
    }
    this.userNamePromise = new Promise<string>((resolve) => {
      auth.onAuthStateChanged(async (user) => {
        if (user) {
          const db = getFirestore(this.firebase.app);
          const userDoc = await getDoc(doc(db, 'users', user.uid));
          if (userDoc.exists()) {
            const data = userDoc.data();
            this.userName = data['name'] || 'User';
            this.userUid = user.uid;
            sessionStorage.setItem('userName', this.userName);
            sessionStorage.setItem('userUid', this.userUid);
            resolve(this.userName);
          } else {
            this.userName = 'User';
            this.userUid = user.uid;
            sessionStorage.setItem('userName', this.userName);
            sessionStorage.setItem('userUid', this.userUid);
            resolve(this.userName);
          }
        } else {
          this.userName = 'User';
          this.userUid = '';
          sessionStorage.setItem('userName', this.userName);
          sessionStorage.setItem('userUid', this.userUid);
          resolve(this.userName);
        }
      });
    });
    return this.userNamePromise;
  }
}
