import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { getFirestore, setDoc, doc, getDoc } from 'firebase/firestore';
import { Firebase } from '../../services/firebase';
import { getAuth } from 'firebase/auth';

@Component({
  selector: 'app-admin-profile',
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-profile.html',
  styleUrl: './admin-profile.css',
})
export class AdminProfile implements OnInit {
  async ngOnInit() {
    const auth = getAuth();
    // Wait for auth state to be ready
    await new Promise((resolve) => {
      const unsub = auth.onAuthStateChanged(() => {
        unsub();
        resolve(null);
      });
    });
    const user = auth.currentUser;
    if (user) {
      const db = getFirestore(this.firebase.app);
      const profileDoc = await getDoc(doc(db, 'profile_data', user.uid));
      if (profileDoc.exists()) {
        const data = profileDoc.data();
        // Update all form and UI-bound variables
        this.mainForm = {
          name: data['name'] || 'Musharof Chowdhury',
          role: data['role'] || 'Team Manager | Arizona, United States.',
          facebook: data['facebook'] || '',
          twitter: data['twitter'] || '',
          linkedin: data['linkedin'] || '',
          instagram: data['instagram'] || '',
        };
        this.personalForm = {
          firstName: data['firstName'] || 'Chowdhury',
          lastName: data['lastName'] || 'Musharof',
          email: data['email'] || 'randomuser@pimjo.com',
          phone: data['phone'] || '+09 363 398 46',
        };
        this.addressForm = {
          country: data['country'] || 'Pakistan',
          cityState: data['cityState'] || 'Kpk,Pakistan',
          postalCode: data['postalCode'] || '24530',
        };
        this.profileName = this.mainForm.name;
        this.profileRole = this.mainForm.role;
        this.profileSocial = {
          facebook: this.mainForm.facebook,
          twitter: this.mainForm.twitter,
          linkedin: this.mainForm.linkedin,
          instagram: this.mainForm.instagram,
        };
        this.personalInfo = { ...this.personalForm };
        this.addressInfo = { ...this.addressForm };
      }
    }
  }
  constructor(public firebase: Firebase) {}
  modalType: string | null = null;

  // Main profile section data
  mainForm = {
    name: '',
    role: '',
    facebook: '',
    twitter: '',
    linkedin: '',
    instagram: '',
  };
  // Personal info section data
  personalForm = {
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
  };
  // Address section data
  addressForm = {
    country: '',
    cityState: '',
    postalCode: '',
  };

  // UI-bound data
  profileName = '';
  profileRole = '';
  profileSocial = {
    facebook: '',
    twitter: '',
    linkedin: '',
    instagram: '',
  };
  personalInfo = {
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
  };
  addressInfo = {
    country: '',
    cityState: '',
    postalCode: '',
  };

  openModal(type: string) {
    this.modalType = type;
  }
  closeModal() {
    this.modalType = null;
  }

  onPictureChange(event: any) {
    // Handle profile picture change logic here
  }

  async saveMain() {
    this.profileName = this.mainForm.name;
    this.profileRole = this.mainForm.role;
    this.profileSocial = {
      facebook: this.mainForm.facebook,
      twitter: this.mainForm.twitter,
      linkedin: this.mainForm.linkedin,
      instagram: this.mainForm.instagram,
    };
    // Save to Firestore ( collection)
    const auth = getAuth();
    const user = auth.currentUser;
    if (user) {
      const db = getFirestore(this.firebase.app);
      await setDoc(doc(db, 'profile_data', user.uid), {
        ...this.mainForm,
        ...this.personalForm,
        ...this.addressForm,
        updatedAt: new Date().toISOString(),
      });
    }
    this.closeModal();
  }
  async savePersonal() {
    this.personalInfo = { ...this.personalForm };
    // Save to Firestore (users collection)
    const auth = getAuth();
    const user = auth.currentUser;
    if (user) {
      const db = getFirestore(this.firebase.app);
      await setDoc(doc(db, 'profile_data', user.uid), {
        ...this.mainForm,
        ...this.personalForm,
        ...this.addressForm,
        updatedAt: new Date().toISOString(),
      });
    }
    this.closeModal();
  }
  async saveAddress() {
    this.addressInfo = { ...this.addressForm };
    // Save to Firestore (users collection)
    const auth = getAuth();
    const user = auth.currentUser;
    if (user) {
      const db = getFirestore(this.firebase.app);
      await setDoc(doc(db, 'profile_data', user.uid), {
        ...this.mainForm,
        ...this.personalForm,
        ...this.addressForm,
        updatedAt: new Date().toISOString(),
      });
    }
    this.closeModal();
  }
}
