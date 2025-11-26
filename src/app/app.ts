import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule,RouterModule,],
  templateUrl: './app.html',
  styleUrls: ['./app.css']
})
export class App {

  username: string | null = localStorage.getItem('username');  
  dropdownOpen = false;

  private router = inject(Router);

  toggleDropdown() {
    this.dropdownOpen = !this.dropdownOpen;
  }

  logout() {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('username');

    this.router.navigate(['/login']);
  }
}
