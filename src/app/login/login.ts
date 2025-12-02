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

        console.log(res);   // Debug

        // 🔥 Correct condition based on your API response
        if (res.statusCode === 200 && res.data?.login === 'success') {

          // STORE TOKEN
          this.auth.storeToken(res.data.accessToken);

          // STORE USERNAME
          localStorage.setItem('username', res.data.username);

          // REDIRECT
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
