import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Header2 } from '../header2/header2';
import { AdminSidebar } from '../admin-sidebar/admin-sidebar';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-admin-layout',
  imports: [CommonModule, Header2, AdminSidebar, RouterOutlet],
  templateUrl: './admin-layout.html',
  styleUrl: './admin-layout.css',
})
export class AdminLayout {}
