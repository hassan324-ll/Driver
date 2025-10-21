import { Injectable } from '@angular/core';
import { Cloudinary as CloudinaryCore } from 'cloudinary-core';

@Injectable({
  providedIn: 'root',
})
export class Cloudinary {
  private cloudinary: CloudinaryCore;

  constructor() {
    // Initialize Cloudinary with your cloud name
    this.cloudinary = new CloudinaryCore({ cloud_name: 'djldxjdtx' });
  }

  // Example method to get a Cloudinary image URL
  getImageUrl(publicId: string, options?: object): string {
    return this.cloudinary.url(publicId, options);
  }
}
