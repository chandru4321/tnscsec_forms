import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private baseUrl = 'https://lg0w5w01-4000.inc1.devtunnels.ms/api';

  constructor(private http: HttpClient) { }


  /** GET → Master Zones */
  getdepartment(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/departments`);
  }
  getdistrict(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/districts`);
  }












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
  getForm1Table(pageNumber: number = 1, pageSize: number = 50): Observable<any> {

    const params = {
      pageNumber: pageNumber,
      pageSize: pageSize
    };

    return this.http.get<any>(`${this.baseUrl}/form1`, { params });
  }

  getForm1Filtered(departmentId?: number, districtId?: number): Observable<any> {

    let params: any = {};

    if (departmentId) params.department_id = departmentId;
    if (districtId) params.district_id = districtId;

    return this.http.get<any>(`${this.baseUrl}/form1`, { params });
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

  // /** GET → Form-1 Selected Societies */
  // getForm1Selected(form1_id: number): Observable<any> {
  //   return this.http.get<any>(`${this.baseUrl}/form2/form1-selected/${form1_id}`);
  // }


  getForm1Selected(form1_id: number): Observable<any> {
    return this.http.get<any>(
      `${this.baseUrl}/form2/form1-selected`,
      {
        params: { form1_id: form1_id }   // 👈 send as query param
      }
    );
  }




  // /** POST → Checkbox (Published / Not Published) */
  // getForm2Checkbox(form1_id: number): Observable<any> {
  //   return this.http.post<any>(`${this.baseUrl}/form2/checkbox/${form1_id}`, {});
  // }

  // getForm2Checkbox(form1_id: number): Observable<any> {
  //   return this.http.post<any>(
  //     `${this.baseUrl}/form2/checkbox`,
  //     { form1_id }
  //   );
  // }
  getForm2Checkbox(form2_id: number): Observable<any> {
    return this.http.post<any>(
      `${this.baseUrl}/form2/checkbox`,
      { form2_id }
    );
  }




  //   /** POST → FORM-2 FINAL SUBMIT */
  //   submitForm2(form1_id: number, payload: any): Observable<any> {
  //     return this.http.post<any>(`${this.baseUrl}/form2/submit/${form1_id}`, payload);
  //   }
  // }
  submitForm2(payload: any): Observable<any> {
    return this.http.post<any>(
      `${this.baseUrl}/form2/submit`,
      payload
    );
  }
  // /** GET → FORM-2 LIST / TABLE */
  // getForm2Table(): Observable<any> {
  //   return this.http.get<any>(`${this.baseUrl}/form2`);
  // }

  getForm2Table(): Observable<any> {
    const token = localStorage.getItem('token');

    return this.http.get<any>(`${this.baseUrl}/form2`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
  }



  loadForm2Table(pageNumber: number = 1, pageSize: number = 50): Observable<any> {

    const params = {
      pageNumber: pageNumber,
      pageSize: pageSize
    };

    return this.http.get<any>(`${this.baseUrl}/form2`, { params });
  }

  loadForm2Filtered(departmentId?: number, districtId?: number): Observable<any> {

    let params: any = {};

    if (departmentId) params.department_id = departmentId;
    if (districtId) params.district_id = districtId;

    return this.http.get<any>(`${this.baseUrl}/form2`, { params });
  }







  //form3


  // getForm3Form2List(form1_id: number): Observable<any> {
  //   return this.http.get<any>(
  //     `${this.baseUrl}/api/form3/form2-list/${form1_id}`
  //   );
  // }
  getForm3Form2List(form1_id: number): Observable<any> {
    return this.http.get<any>(
      `${this.baseUrl}/form3/form2-list`,
      { params: { form1_id } }
    );
  }


  // ---------- FORM 3 SUBMIT ----------
  submitForm3(payload: any): Observable<any> {
    return this.http.post<any>(
      `${this.baseUrl}/form3/submit`,
      payload
    );
  }


  //form3 table 

  getForm3Table(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/form3`);
  }

  loadForm3Table(pageNumber: number = 1, pageSize: number = 50): Observable<any> {

    const params = {
      pageNumber: pageNumber,
      pageSize: pageSize
    };

    return this.http.get<any>(`${this.baseUrl}/form3`, { params });
  }

  loadForm3Filtered(departmentId?: number, districtId?: number): Observable<any> {

    let params: any = {};

    if (departmentId) params.department_id = departmentId;
    if (districtId) params.district_id = districtId;

    return this.http.get<any>(`${this.baseUrl}/form3`, { params });
  }











  // 1️⃣ LOAD FORM-4 DATA (for F3 + base list)
  getForm4(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/form4`);
  }

  // SAVE checkbox selection (PREVIEW)  do not dellete tisone 



  // 2️⃣ CHECKBOX STATUS (published / not-published)
  getForm4Checkbox(form4_id: number): Observable<any> {
    return this.http.post<any>(
      `${this.baseUrl}/form4/checkbox`,
      { form4_id }
    );
  }
  saveForm4Checkbox(payload: { selected_ids: number[] }): Observable<any> {
    return this.http.post<any>(
      `${this.baseUrl}/form4/checkbox`,
      payload
    );
  }




  // 4️⃣ FINAL submit
  submitForm4(payload: any): Observable<any> {
    return this.http.post<any>(
      `${this.baseUrl}/form4/submit`,
      payload
    );
  }


  getForm4Table(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/form4/list`);
  }



  loadForm4Table(pageNumber: number = 1, pageSize: number = 50): Observable<any> {

    const params = {
      pageNumber: pageNumber,
      pageSize: pageSize
    };

    return this.http.get<any>(`${this.baseUrl}/form4`, { params });
  }

  loadForm4Filtered(departmentId?: number, districtId?: number): Observable<any> {

    let params: any = {};

    if (departmentId) params.department_id = departmentId;
    if (districtId) params.district_id = districtId;

    return this.http.get<any>(`${this.baseUrl}/form4`, { params });
  }


























  // 2️⃣ LOAD FORM-5 DATA (for F5 – unselected societies)
  // 3️⃣ LOAD FORM-5 ELIGIBLE DATA
  getForm5Eligible(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/form5/eligible`);
  }

  submitForm5(payload: any): Observable<any> {
    return this.http.post<any>(
      `${this.baseUrl}/form5/submit`,
      payload
    );
  }
  getForm5Table(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/form5`);
  }




  loadForm5Table(pageNumber: number = 1, pageSize: number = 50): Observable<any> {

    const params = {
      pageNumber: pageNumber,
      pageSize: pageSize
    };

    return this.http.get<any>(`${this.baseUrl}/form5`, { params });
  }

  loadForm5Filtered(departmentId?: number, districtId?: number): Observable<any> {

    let params: any = {};

    if (departmentId) params.department_id = departmentId;
    if (districtId) params.district_id = districtId;

    return this.http.get<any>(`${this.baseUrl}/form5`, { params });
  }















  getForm5bpreview(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/form5b/preview`);
  }

  postsocietystop(payload: any): Observable<any> {
    return this.http.post<any>(
      `${this.baseUrl}/form5b/stop-society`,
      payload
    );
  }
  postcandidatestop(payload: any): Observable<any> {
    return this.http.post<any>(
      `${this.baseUrl}/form5b/stop-candidates`,
      payload
    );

  }
  getForm5blisttable(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/form5b/list`);
  }



  submitForm5b(payload: any): Observable<any> {
    return this.http.post<any>(
      `${this.baseUrl}/form5b/submit`,
      payload
    );
  }




































  // ================= FORM 6 =================

  // TABLE / PREVIEW DATA
  // FORM 6 INIT  ✅ GET (not POST)
  initForm6(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/form6/init`);
  }

  // FORM 6 PREVIEW
  getForm6Preview(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/form6/preview`);
  }

  simulateForm6(payload: any): Observable<any> {
    return this.http.post<any>(
      `${this.baseUrl}/form6/simulate`,
      payload
    );
  }
  stopElectionForm6(payload: any): Observable<any> {
    return this.http.post<any>(
      `${this.baseUrl}/form6/stop-election`,
      payload
    );
  }



  withdrawForm6(payload: any): Observable<any> {
    return this.http.post<any>(
      `${this.baseUrl}/form6/withdraw`,
      payload
    );
  }
  getForm6Table(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/form6/list`);
  }

  submitForm6(payload: any): Observable<any> {
    return this.http.post<any>(
      `${this.baseUrl}/form6/submit`,
      payload
    );
  }



  loadForm6Table(pageNumber: number = 1, pageSize: number = 50): Observable<any> {

    const params = {
      pageNumber: pageNumber,
      pageSize: pageSize
    };

    return this.http.get<any>(`${this.baseUrl}/form6`, { params });
  }

  loadForm6Filtered(departmentId?: number, districtId?: number): Observable<any> {

    let params: any = {};

    if (departmentId) params.department_id = departmentId;
    if (districtId) params.district_id = districtId;

    return this.http.get<any>(`${this.baseUrl}/form6`, { params });
  }








  // FORM 6 PREVIEW
  getForm7Preview(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/form7/preview`);
  }



  submitForm7(payload: any) {
    return this.http.post<any>(`${this.baseUrl}/form7/submit`, payload);
  }

  getForm7Table(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/form7`);
  }

  loadForm7Table(pageNumber: number = 1, pageSize: number = 50): Observable<any> {

    const params = {
      pageNumber: pageNumber,
      pageSize: pageSize
    };

    return this.http.get<any>(`${this.baseUrl}/form7`, { params });
  }

  loadForm7Filtered(departmentId?: number, districtId?: number): Observable<any> {

    let params: any = {};

    if (departmentId) params.department_id = departmentId;
    if (districtId) params.district_id = districtId;

    return this.http.get<any>(`${this.baseUrl}/form7`, { params });
  }










  getForm8Preview(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/form8/preview`);
  }
  saveForm8Checkbox(payload: any): Observable<any> {
    return this.http.post<any>(
      `${this.baseUrl}/form8/checkbox`,
      payload
    );
  }


  submitForm8(payload: any): Observable<any> {
    return this.http.post<any>(
      `${this.baseUrl}/form8/submit`,
      payload
    );
  }
  getForm8Table(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/form8`);
  }


  loadForm8Table(pageNumber: number = 1, pageSize: number = 50): Observable<any> {

    const params = {
      pageNumber: pageNumber,
      pageSize: pageSize
    };

    return this.http.get<any>(`${this.baseUrl}/form8`, { params });
  }

  loadForm8Filtered(departmentId?: number, districtId?: number): Observable<any> {

    let params: any = {};

    if (departmentId) params.department_id = departmentId;
    if (districtId) params.district_id = districtId;

    return this.http.get<any>(`${this.baseUrl}/form8`, { params });
  }











  form9init(payload: any) {
    return this.http.post(`${this.baseUrl}/form9/init`, payload);
  }

  getForm9Preview(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/form9/preview`);
  }

  form9reject(payload: any) {
    return this.http.post(`${this.baseUrl}/form9/reject`, payload);
  }
  form9withdraw(payload: any) {
    return this.http.post(`${this.baseUrl}/form9/withdraw`, payload);
  }
  form9societyfinalize(payload: any) {
    return this.http.post(`${this.baseUrl}/form9/society-finalize`, payload);
  }
  form9submit(payload: any) {
    return this.http.post(`${this.baseUrl}/form9/submit`, payload);
  }
  getForm9List() {
    return this.http.get<any>(`${this.baseUrl}/form9`);
  }

  loadForm9Table(pageNumber: number = 1, pageSize: number = 50): Observable<any> {

    const params = {
      pageNumber: pageNumber,
      pageSize: pageSize
    };

    return this.http.get<any>(`${this.baseUrl}/form9`, { params });
  }

  loadForm9Filtered(departmentId?: number, districtId?: number): Observable<any> {

    let params: any = {};

    if (departmentId) params.department_id = departmentId;
    if (districtId) params.district_id = districtId;

    return this.http.get<any>(`${this.baseUrl}/form9`, { params });
  }










  form10init(payload: any) {
    return this.http.post(`${this.baseUrl}/form10/init`, payload);
  }

  getForm10Preview(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/form10/preview`);
  }

  form10reject(payload: any) {
    return this.http.post(`${this.baseUrl}/form10/reject`, payload);
  }
  form10withdraw(payload: any) {
    return this.http.post(`${this.baseUrl}/form10/withdraw`, payload);
  }
  form10societyfinalize(payload: any) {
    return this.http.post(`${this.baseUrl}/form10/society-finalize`, payload);
  }
  form10submit(payload: any) {
    return this.http.post(`${this.baseUrl}/form10/submit`, payload);
  }
  getForm10List() {
    return this.http.get<any>(`${this.baseUrl}/form10`);
  }
  loadForm10Table(pageNumber: number = 1, pageSize: number = 50): Observable<any> {

    const params = {
      pageNumber: pageNumber,
      pageSize: pageSize
    };

    return this.http.get<any>(`${this.baseUrl}/form10`, { params });
  }

  loadForm10Filtered(departmentId?: number, districtId?: number): Observable<any> {

    let params: any = {};

    if (departmentId) params.department_id = departmentId;
    if (districtId) params.district_id = districtId;

    return this.http.get<any>(`${this.baseUrl}/form10`, { params });
  }
















































}






















