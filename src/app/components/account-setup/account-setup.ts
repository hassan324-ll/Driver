import { Component } from '@angular/core';
// Header not used in template (commented out)
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Firebase } from '../../services/firebase';
import { Cloudinary } from '../../services/cloudinary';
import { Router } from '@angular/router';
import { getAuth } from 'firebase/auth';
// Footer not used in template (commented out)
@Component({
  selector: 'app-account-setup',
  imports: [CommonModule, FormsModule],
  templateUrl: './account-setup.html',
  styleUrl: './account-setup.css',
})
export class AccountSetup {
  firstName: string = '';
  lastName: string = '';
  email: string = '';
  cityState: string = '';
  address: string = '';
  postalCode: string = '';
  country: string = '';
  profilePicFile: File | null = null;
  profilePicPreview: string | null = null;
  error: string = '';

  constructor(private firebase: Firebase, private cloudinary: Cloudinary, private router: Router) {}

  onProfilePicSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.profilePicFile = file;
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.profilePicPreview = e.target.result;
      };
      reader.readAsDataURL(file);
    } else {
      this.profilePicFile = null;
      this.profilePicPreview = null;
    }
  }

  async uploadToCloudinary(file: File): Promise<string> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'profile-pic'); // Replace with your Cloudinary upload preset
    const response = await fetch('https://api.cloudinary.com/v1_1/djldxjdtx/image/upload', {
      method: 'POST',
      body: formData,
    });
    const data = await response.json();
    return data.secure_url;
  }

  async onSubmitDetails() {
    this.error = '';
    try {
      const auth = getAuth();
      const user = auth.currentUser;
      if (!user) {
        this.error = 'User not authenticated.';
        return;
      }
      let profilePicUrl = '';
      if (this.profilePicFile) {
        profilePicUrl = await this.uploadToCloudinary(this.profilePicFile);
        if (!profilePicUrl) {
          this.error = 'Profile picture upload failed.';
          return;
        }
      }
      const dataToSave: any = {
        firstName: this.firstName,
        lastName: this.lastName,
        email: this.email,
        cityState: this.cityState,
        address: this.address,
        postalCode: this.postalCode,
        country: this.country,
      };
      if (profilePicUrl) {
        dataToSave.profilePicUrl = profilePicUrl;
      }
      await this.firebase.saveAccountSetupData(user.uid, dataToSave);
      this.router.navigate(['/home']);
    } catch (err: any) {
      this.error = err.message || 'Failed to save details.';
    }
  }
}
