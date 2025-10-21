import { Component } from '@angular/core';
import { Header } from '../header/header';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Footer } from '../footer/footer';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-homepage',
  imports: [Header, CommonModule, RouterLink, Footer],
  templateUrl: './homepage.html',
  styleUrl: './homepage.css',
})
export class Homepage {
  userName: string = '';

  constructor(private userService: UserService) {
    this.loadUserName();
  }

  async loadUserName() {
    this.userName = await this.userService.getUserName();
  }
}
