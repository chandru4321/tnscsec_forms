import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private baseUrl = 'https://lg0w5w01-4000.inc1.devtunnels.ms/api';

  constructor(private http: HttpClient) { }

  /** =========================
   * FORM-1 APIs
   * ========================= */

  /** GET → Master Zones */
  getMasterZones(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/form1/master-zones`);
  }

  /** POST → Checkpoint Zones */
  PostCheckpointZones(body: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/form1/checkpoint-zones`, body);
  }

  /** POST → Get Rural Society Details */
  getRuralSocietyDetails(body: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/form1/rural-details`, body);
  }

  /** POST → FORM-1 FINAL SUBMIT */
  submitForm1(data: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/form1/submit`, data);
  }

  /** GET → FORM-1 TABLE / LIST */
  getForm1Table(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/form1`);
  }


  /** =========================
   * FORM-1 EDIT APIs
   * ========================= */

  /** GET → Get Form1 By ID (For Edit Load) */
  getForm1ById(id: number): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/form1/${id}`);
  }

  /** POST → FORM-1 EDIT SUBMIT */
  // editForm1(data: any): Observable<any> {
  //   return this.http.put<any>(`${this.baseUrl}/form1/edit`, data);
  // }
  editForm1(id: number, data: any): Observable<any> {
    return this.http.put<any>(`${this.baseUrl}/form1/edit/${id}`, data);
  }










































































  /** =========================
   * FORM-2 APIs
   * ========================= */

  /** GET → Form-1 Selected Societies */
  getForm1Selected(form1_id: number): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/form2/form1-selected/${form1_id}`);
  }

  /** POST → Checkbox (Published / Not Published) */
  getForm2Checkbox(form1_id: number): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/form2/checkbox/${form1_id}`, {});
  }

  /** POST → FORM-2 FINAL SUBMIT */
  submitForm2(form1_id: number, payload: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/form2/submit/${form1_id}`, payload);
  }
}
