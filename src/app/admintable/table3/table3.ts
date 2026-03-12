import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserService } from '../../services/user';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

interface TableRow {
  district_name: string;
  zone_name: string;
  society_name: string;
  ass_memlist: number | null;
  ero_claim: string;
  jcount: number;
  rcount: number;
  tot_voters: number | null;
  rowSpan?: number;
}

@Component({
  selector: 'app-formt3',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './table3.html',
  styleUrls: ['./table3.css']
})
export class Table3 implements OnInit {

  tableRows: TableRow[] = [];
  originalRows: TableRow[] = [];

  department_name = '';

  /* FILTER VALUES */
  selectedDepartment: string = '';
  selectedDistrict: string = '';

  /* MASTER LISTS */
  departmentList: { id: number; name: string }[] = [];
  districtList: { id: number; name: string }[] = [];

  constructor(private userService: UserService) { }

  ngOnInit(): void {

    this.loadForm3();
    this.loadDepartments();
    this.loadDistricts();

  }

  /* =========================
     LOAD MASTER DATA
  ========================= */

  loadDepartments(): void {

    this.userService.getdepartment().subscribe((res: any) => {

      if (res?.success && Array.isArray(res.data)) {

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

    this.userService.getdistrict().subscribe((res: any) => {

      if (res?.success && Array.isArray(res.data)) {

        this.districtList = res.data
          .filter((d: any) => d.is_active === 1)
          .map((d: any) => ({
            id: d.id,
            name: d.name.trim()
          }));

      }

    });

  }

  /* =========================
     LOAD TABLE
  ========================= */

  loadForm3(): void {

    this.userService.loadForm3Table().subscribe({

      next: (res: any) => {

        const apiData = res?.data?.data;

        if (res?.success && Array.isArray(apiData) && apiData.length > 0) {

          this.department_name = apiData[0].department_name;

          this.prepareRows(apiData);

          this.originalRows = [...this.tableRows];

        } else {

          this.tableRows = [];

        }

      }

    });

  }

  /* =========================
     TRANSFORM DATA
  ========================= */

  private prepareRows(data: any[]): void {

    const rows: TableRow[] = [];

    data.forEach(item => {

      const societies = item.societies || [];

      const span = societies.length;

      societies.forEach((soc: any, index: number) => {

        rows.push({

          district_name: item.district_name,
          zone_name: item.zone_name,

          society_name: soc.society_name,

          ass_memlist: soc.ass_memlist ?? null,

          ero_claim:
            soc.ero_claim === 1 ? 'ஆம்'
              : soc.ero_claim === 0 ? 'இல்லை'
                : '-',

          jcount: soc.jcount ?? 0,
          rcount: soc.rcount ?? 0,

          tot_voters: soc.tot_voters ?? null,

          rowSpan: index === 0 ? span : 0

        });

      });

    });

    this.tableRows = rows;

  }

  /* =========================
     APPLY FILTER
  ========================= */

  applyFilter(): void {

    const deptId = this.departmentList
      .find(d => d.name === this.selectedDepartment)?.id;

    const distId = this.districtList
      .find(d => d.name === this.selectedDistrict)?.id;

    this.userService.loadForm3Filtered(deptId, distId)
      .subscribe((res: any) => {

        const apiData = res?.data?.data;

        if (Array.isArray(apiData) && apiData.length > 0) {

          this.prepareRows(apiData);
          this.originalRows = [...this.tableRows];

        } else {

          this.tableRows = [];
          this.originalRows = [];

        }

      });

  }

  /* =========================
     CLEAR FILTER
  ========================= */

  clearFilter(): void {

    this.selectedDepartment = '';
    this.selectedDistrict = '';

    this.loadForm3();

  }

  /* =========================
     EXPORT EXCEL
  ========================= */

  exportToExcel(): void {

    const table = document.getElementById('reportTable');
    if (!table) return;

    const worksheet = XLSX.utils.table_to_sheet(table);

    const workbook = {
      Sheets: { Report: worksheet },
      SheetNames: ['Report']
    };

    const buffer = XLSX.write(workbook, {
      bookType: 'xlsx',
      type: 'array'
    });

    saveAs(new Blob([buffer]), 'Form3_Report.xlsx');

  }

}