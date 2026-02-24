import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../services/auth';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {

  username: string = '';
  password: string = '';

  private auth = inject(AuthService);
  private router = inject(Router);

  login() {

    // -------- ADMIN STATIC LOGIN --------
    if (this.username === 'admin' && this.password === 'admin') {
      localStorage.setItem('role', 'admin');
      this.router.navigate(['/layout/admin-dashboard']);
      return;
    }
    // ------------------------------------

    // Normal user login (existing code)
    this.auth.login(this.username, this.password).subscribe({
      next: (res: any) => {

        console.log(res);

        if (res.statusCode === 200 && res.data?.login === 'success') {

          // Store token
          this.auth.storeToken(res.data.accessToken);

          // Store username
          localStorage.setItem('username', res.data.username);

          localStorage.setItem('department_name', res.data.department_name);
          localStorage.setItem('district_name', res.data.district_name);
          localStorage.setItem('zone_name', res.data.zone_name);
          localStorage.setItem('auth_token', res.data.accessToken);

          localStorage.setItem('role', 'user');

          // Redirect normal user
          this.router.navigate(['/layout/totalforms']);

        } else {
          alert("Invalid username or password");
        }
      },
      error: (err) => {
        alert("Invalid username or password");
        console.error(err);
      }
    });
  }
}