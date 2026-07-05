import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { CommonModule } from '@angular/common';
import { UserService } from '../../services/user';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-formt7',
  templateUrl: './table7.html',
  styleUrl: './table7.css',
  imports: [CommonModule, FormsModule, RouterModule],
  standalone: true,
})
export class Table7 implements OnInit {

  // Old content kept (not removed)
  baseUrl = 'YOUR_API_BASE_URL';

  form7Data: any;
  societies: any[] = [];
  department_name = '';

  selectedDepartment = '';
  selectedDistrict = '';

  departmentList: { id: number; name: string }[] = [];
  districtList: { id: number; name: string }[] = [];

  constructor(
    private userservice: UserService,
    private http: HttpClient   // kept because old code uses it
  ) { }

  ngOnInit(): void {

    this.loadDepartments();
    this.loadDistricts();
    this.loadForm7();

  }

  loadDepartments(): void {

    this.userservice.getdepartment().subscribe((res: any) => {

      if (res?.success) {

        this.departmentList = res.data
          .filter((d: any) => d.is_active === 1)
          .map((d: any) => ({
            id: d.id,
            name: d.name.trim()
          }));

      }

    });

  }

  loadDistricts(): void {

    this.userservice.getdistrict().subscribe((res: any) => {

      if (res?.success) {

        this.districtList = res.data
          .filter((d: any) => d.is_active === 1)
          .map((d: any) => ({
            id: d.id,
            name: d.name.trim()
          }));

      }

    });

  }


  loadForm7(): void {

    this.userservice.loadForm7Filtered().subscribe({

      next: (res: any) => {

        console.log(res);

        if (!res.success || !res.data?.length) {

          this.societies = [];
          return;

        }

        this.form7Data = res.data[0];

        this.department_name =
          this.form7Data.department?.name || '';

        this.societies =
          this.form7Data.societies || [];

      },

      error: err => console.log(err)

    });

  }

  applyFilter(): void {

    const deptId = this.departmentList.find(
      d => d.name === this.selectedDepartment
    )?.id;

    const distId = this.districtList.find(
      d => d.name === this.selectedDistrict
    )?.id;

    this.userservice.loadForm7Filtered(deptId, distId)
      .subscribe({

        next: (res: any) => {

          if (!res.success || !res.data?.length) {

            this.societies = [];
            return;

          }

          this.form7Data = res.data[0];

          this.department_name =
            this.form7Data.department?.name || '';

          this.societies =
            this.form7Data.societies || [];

        }

      });

  }
  // API CALL (Fixed to use UserService)
  getForm7Table() {
    this.userservice.getForm7Table().subscribe({
      next: (res: any) => {
        console.log('Form7 Response:', res);

        if (res.data && res.data.length > 0) {
          this.form7Data = res.data[0];   // take first object
          this.societies = this.form7Data.societies || [];
        }
      },
      error: (err) => {
        console.error('Form7 Error:', err);
      }
    });
  }
  // Rural values
  getRuralValue(society: any, type: string) {
    return society.rural?.[type] || 0;
  }

  // Declared values only if eligible = true
  getDeclaredValue(society: any, type: string) {
    const cat = society.qualified_categories?.[type];
    return cat && cat.eligible ? cat.count : 0;
  }

  getDeclaredTotal(society: any) {
    let total = 0;
    ['sc_st', 'women', 'general'].forEach(type => {
      const cat = society.qualified_categories?.[type];
      if (cat && cat.eligible) {
        total += cat.count;
      }
    });
    return total;
  }

  downloadPdf(): void {

    const departmentId = this.departmentList.find(
      d => d.name === this.selectedDepartment
    )?.id;

    this.userservice.getForm7Pdf(departmentId!)
      .subscribe({

        next: (res: Blob) => {

          saveAs(
            new Blob([res], { type: 'application/pdf' }),
            'Form7_Report.pdf'
          );

        }

      });

  }
}