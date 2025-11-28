import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [],
  templateUrl: './header.html',
  styleUrls: ['./header.css'],
})
export class Header {

  username: string | null = localStorage.getItem('username');
  dropdownOpen = false;

  private router = inject(Router);

  toggleDropdown() {
    this.dropdownOpen = !this.dropdownOpen;
  }

  logout() {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('username');

    this.dropdownOpen = false;   // 🔥 closes dropdown automatically

    this.router.navigate(['/login']);
  }
}
