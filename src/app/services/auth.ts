import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";

@Injectable({ providedIn: 'root' })
export class AuthService {

  private loginApi = 'https://lg0w5w01-4000.inc1.devtunnels.ms/api/auth/login';
  private tokenKey = 'token'; // 🔥 FIX

  constructor(private http: HttpClient) { }

  login(username: string, password: string) {
    return this.http.post(this.loginApi, { username, password });
  }

  storeToken(token: string) {
    localStorage.setItem(this.tokenKey, token);
  }

  getToken() {
    return localStorage.getItem(this.tokenKey);
  }

}
