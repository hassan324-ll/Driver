import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-not-found-redirect',
  templateUrl: './not-found-redirect.html',
})
export class NotFoundRedirect {
  constructor(private router: Router) {}

  goHome() {
    this.router.navigate(['/home']);
  }

  goLogin() {
    this.router.navigate(['/login']);
  }
}
