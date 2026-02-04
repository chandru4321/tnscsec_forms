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
    this.auth.login(this.username, this.password).subscribe({
      next: (res: any) => {

        console.log(res);

        if (res.statusCode === 200 && res.data?.login === 'success') {

          // Store token
          this.auth.storeToken(res.data.accessToken);

          // Store username
          localStorage.setItem('username', res.data.username);

          // Store IDs for Form1
          localStorage.setItem('department_name', res.data.department_name);
          localStorage.setItem('district_name', res.data.district_name);
          localStorage.setItem('zone_name', res.data.zone_name);
          localStorage.setItem('auth_token', res.data.accessToken);



          // Redirect
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
