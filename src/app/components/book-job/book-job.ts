import { Component } from '@angular/core';
import { Header } from '../header/header';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Firebase, JobBookingData } from '../../services/firebase';
import { Cloudinary } from '../../services/cloudinary';
import { getAuth } from 'firebase/auth';

@Component({
  selector: 'app-book-job',
  imports: [Header, FormsModule, CommonModule],
  templateUrl: './book-job.html',
  styleUrl: './book-job.css',
})
export class BookJob {
  customerName: string = '';
  carName: string = '';
  bookingDate: string = '';
  bookingTime: string = '';
  areasAffected: string = '';
  workRequired: string = '';
  trackingAdjusted: string = '';
  newComponents: string = '';
  note: string = '';
  images: File[] = [];
  imageUrl: string = '';
  successMessage: string = '';
  // Field error messages
  errors: any = {};

  constructor(private firebase: Firebase, private cloudinary: Cloudinary) {}
  // Handle file input change
  onFileChange(event: any) {
    const files = event.target.files;
    if (files && files.length > 0) {
      this.images = Array.from(files);
    } else {
      this.images = [];
    }
  }

  async onSubmitJob() {
    this.errors = {};
    // Validate required fields
    if (!this.customerName.trim()) this.errors.customerName = 'Customer name is required.';
    if (!this.carName.trim()) this.errors.carName = 'Car name is required.';
    if (!this.bookingDate) this.errors.bookingDate = 'Booking date is required.';
    if (!this.bookingTime) this.errors.bookingTime = 'Booking time is required.';
    if (!this.areasAffected) this.errors.areasAffected = 'Please select an area.';
    if (!this.workRequired.trim()) this.errors.workRequired = 'Work required is required.';
    if (!this.trackingAdjusted) this.errors.trackingAdjusted = 'Please select an option.';
    if (!this.newComponents) this.errors.newComponents = 'Please select an option.';

    if (Object.keys(this.errors).length > 0) {
      return;
    }

    const auth = getAuth();
    const user = auth.currentUser;
    if (!user) {
      this.successMessage = '';
      return;
    }
    let imageUrl = '';
    if (this.images.length > 0) {
      // Upload the first image to Cloudinary
      const file = this.images[0];
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', 'drivealign_unsigned'); // Use your Cloudinary unsigned upload preset
      try {
        const response = await fetch(`https://api.cloudinary.com/v1_1/djldxjdtx/image/upload`, {
          method: 'POST',
          body: formData,
        });
        const data = await response.json();
        imageUrl = typeof data.secure_url === 'string' ? data.secure_url : '';
      } catch (error) {
        this.successMessage = 'Image upload failed.';
        return;
      }
    }
    // Always provide imageUrl as a string, never undefined
    const jobData: JobBookingData = {
      customerName: this.customerName,
      carName: this.carName,
      bookingDate: this.bookingDate,
      bookingTime: this.bookingTime,
      areasAffected: this.areasAffected,
      workRequired: this.workRequired,
      trackingAdjusted: this.trackingAdjusted,
      newComponents: this.newComponents,
      note: this.note,
      imageUrl: imageUrl || '',
      userId: user.uid,
    };
    await this.firebase.saveJobBooking(jobData);
    this.successMessage = 'Job submitted successfully!';
    this.customerName = '';
    this.carName = '';
    this.bookingDate = '';
    this.bookingTime = '';
    this.areasAffected = '';
    this.workRequired = '';
    this.trackingAdjusted = '';
    this.newComponents = '';
    this.note = '';
    this.images = [];
    this.imageUrl = '';
  }
}
