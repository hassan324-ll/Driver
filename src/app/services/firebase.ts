export interface JobBookingData {
  customerName: string;
  carName: string;
  bookingDate: string;
  bookingTime: string;
  areasAffected: string;
  workRequired: string;
  trackingAdjusted: string;
  newComponents: string;
  note: string;
  imageUrl?: string;
  userId: string;
}
import { Injectable } from '@angular/core';
import { initializeApp, FirebaseApp } from 'firebase/app';
import { firebaseConfig } from './firebase.config';
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  UserCredential,
} from 'firebase/auth';
import { getFirestore, setDoc, doc } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
@Injectable({
  providedIn: 'root',
})
export class Firebase {
  public app: FirebaseApp;

  constructor() {
    this.app = initializeApp(firebaseConfig);
  }

  // Save job booking data to Firestore
  async saveJobBooking(jobData: JobBookingData): Promise<void> {
    const db = getFirestore(this.app);
    // Generate a unique job ID (could use Firestore auto-ID in a real app)
    const jobId = `${jobData.userId}_${Date.now()}`;
    await setDoc(doc(db, 'jobs', jobId), {
      ...jobData,
      status: 'pending',
      createdAt: new Date().toISOString(),
    });
  }
  // Upload profile picture to Firebase Storage and return its URL
  async uploadProfilePicture(uid: string, file: File): Promise<string> {
    const storage = getStorage(this.app);
    const storageRef = ref(storage, `profile_pictures/${uid}`);
    await uploadBytes(storageRef, file);
    return await getDownloadURL(storageRef);
  }
  //for account setup data which will save in firestore under user_data collection
  async saveAccountSetupData(
    uid: string,
    data: {
      firstName: string;
      lastName: string;
      email: string;
      cityState: string;
      address: string;
      postalCode: string;
      country: string;
      profilePicUrl?: string;
    }
  ): Promise<void> {
    const db = getFirestore(this.app);
    await setDoc(doc(db, 'user_data', uid), {
      ...data,
      updatedAt: new Date().toISOString(),
    });
  }

  //for signup user with email and password and store additional data in firestore
  async signupUser(userData: {
    name: string;
    email: string;
    phone: string;
    password: string;
  }): Promise<UserCredential> {
    const auth = getAuth(this.app);
    const db = getFirestore(this.app);
    // Create user in Firebase Auth
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      userData.email,
      userData.password
    );
    // Store additional user data in Firestore
    await setDoc(doc(db, 'users', userCredential.user.uid), {
      name: userData.name,
      email: userData.email,
      phone: userData.phone,
      createdAt: new Date().toISOString(),
    });
    return userCredential;
  }
  //for login user with email and password

  async loginUser(email: string, password: string): Promise<UserCredential> {
    const auth = getAuth(this.app);
    return await signInWithEmailAndPassword(auth, email, password);
  }
}
