import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private baseUrl = 'https://lg0w5w01-4000.inc1.devtunnels.ms/api';

  constructor(private http: HttpClient) {}

  // 🔹 Load Master Zones API
  getMasterZones(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/form1/master-zones`);
  }

  // 🔹 Submit Form
  submitForm(data: FormData): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/complaint-register-form1`, data);
  }

}
