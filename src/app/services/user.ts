import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private baseUrl = 'https://lg0w5w01-4000.inc1.devtunnels.ms/api';

  constructor(private http: HttpClient) {}

  /** GET Master Zones */
  getMasterZones(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/form1/master-zones`);
  }

  /** POST → Checkpoint Zones */
  PostCheckpointZones(body: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/form1/checkpoint-zones`, body);
  }

  /** POST → Get Rural Details */
  getRuralSocietyDetails(body: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/form1/rural-details`, body);
  }

  /** FORM–1 FINAL SUBMIT */
  submitForm1(data: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/form1/submit`, data);
  }

  /** FORM-2 — Fetch Form-1 Selected Societies */
  getForm1Selected(form1_id: number): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/form2/form1-selected/${form1_id}`);
  }

  /** FORM-2 — Fetch Checkbox (Published / Not Published) */
  getForm2Checkbox(form1_id: number): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/form2/checkbox/${form1_id}`, {});
  }

  /** ✅ FORM-2 — FINAL SUBMIT API */
  submitForm2(form1_id: number, payload: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/form2/submit/${form1_id}`, payload);
  }

}
