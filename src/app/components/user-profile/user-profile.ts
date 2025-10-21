import { Component, OnInit } from '@angular/core';
import { Header } from '../header/header';
import { Firebase } from '../../services/firebase';
import { getAuth } from 'firebase/auth';

function clearProfileCache() {
  sessionStorage.removeItem('profilePicUrl');
  sessionStorage.removeItem('profileFirstName');
  sessionStorage.removeItem('profileLastName');
  sessionStorage.removeItem('profileEmail');
  sessionStorage.removeItem('profileCityState');
  sessionStorage.removeItem('profileAddress');
  sessionStorage.removeItem('profilePostalCode');
  sessionStorage.removeItem('profileCountry');
}

@Component({
  selector: 'app-user-profile',
  imports: [Header],
  templateUrl: './user-profile.html',
  styleUrl: './user-profile.css',
})
export class UserProfile implements OnInit {
  profilePicUrl: string = './profile.jpeg';
  firstName: string = '';
  lastName: string = '';
  email: string = '';
  cityState: string = '';
  address: string = '';
  postalCode: string = '';
  country: string = '';
  private lastUid: string | null = null;

  constructor(private firebase: Firebase) {}

  async ngOnInit() {
    const auth = getAuth();
    await new Promise<void>((resolve) => {
      const unsub = auth.onAuthStateChanged(() => {
        unsub();
        resolve();
      });
    });
    const user = auth.currentUser;
    const cachedUid = sessionStorage.getItem('profileUid');
    if (user && cachedUid === user.uid) {
      const cachedPic = sessionStorage.getItem('profilePicUrl');
      const cachedFirst = sessionStorage.getItem('profileFirstName');
      const cachedLast = sessionStorage.getItem('profileLastName');
      const cachedEmail = sessionStorage.getItem('profileEmail');
      const cachedCity = sessionStorage.getItem('profileCityState');
      const cachedAddress = sessionStorage.getItem('profileAddress');
      const cachedPostal = sessionStorage.getItem('profilePostalCode');
      const cachedCountry = sessionStorage.getItem('profileCountry');
      if (
        cachedPic &&
        cachedFirst &&
        cachedLast &&
        cachedEmail &&
        cachedCity &&
        cachedAddress &&
        cachedPostal &&
        cachedCountry
      ) {
        this.profilePicUrl = cachedPic;
        this.firstName = cachedFirst;
        this.lastName = cachedLast;
        this.email = cachedEmail;
        this.cityState = cachedCity;
        this.address = cachedAddress;
        this.postalCode = cachedPostal;
        this.country = cachedCountry;
        return;
      }
    } else {
      clearProfileCache();
    }
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
        this.firstName = data['firstName'] || '';
        this.lastName = data['lastName'] || '';
        this.email = data['email'] || '';
        this.cityState = data['cityState'] || '';
        this.address = data['address'] || '';
        this.postalCode = data['postalCode'] || '';
        this.country = data['country'] || '';
        sessionStorage.setItem('profileUid', user.uid);
        sessionStorage.setItem('profilePicUrl', this.profilePicUrl);
        sessionStorage.setItem('profileFirstName', this.firstName);
        sessionStorage.setItem('profileLastName', this.lastName);
        sessionStorage.setItem('profileEmail', this.email);
        sessionStorage.setItem('profileCityState', this.cityState);
        sessionStorage.setItem('profileAddress', this.address);
        sessionStorage.setItem('profilePostalCode', this.postalCode);
        sessionStorage.setItem('profileCountry', this.country);
      }
    }
  }
}
