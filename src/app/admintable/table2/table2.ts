import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { UserService } from '../../services/user';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

/* =========================
   INTERFACES
========================= */

interface Society {
  society_id: number;
  society_name: string;
}

interface Form2ApiRow {
  id: number;
  department_name: string;
  district_name: string;
  zone_name: string;

  masterzone_societies: Society[];
  selected_soc: Society[];
  non_selected_soc: Society[];

  non_selected_count: number;
  remark: string;
}

interface TableRow {
  district_name: string;
  zone_name: string;

  f3_name: string | null;
  f5_name: string | null;
  f6_name: string | null;

  non_selected_count?: number;
  remark?: string;
  rowSpan?: number;
}

/* =========================
   COMPONENT
========================= */

@Component({
  selector: 'app-table2',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './table2.html',
  styleUrls: ['./table2.css']
})
export class Table2 implements OnInit {

  department_name: string = '';
  tableRows: TableRow[] = [];
  originalRows: TableRow[] = [];

  selectedDepartment: string = '';
  selectedDistrict: string = '';

  departmentList: { id: number; name: string }[] = [];
  districtList: { id: number; name: string }[] = [];

  constructor(private userService: UserService) { }

  ngOnInit(): void {

    this.loadForm2Table();
    this.loadDepartments();
    this.loadDistricts();

  }

  /* =========================
     LOAD MASTER DATA
  ========================= */

  loadDepartments(): void {

    this.userService.getdepartment().subscribe((res: any) => {

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

    this.userService.getdistrict().subscribe((res: any) => {

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

  /* =========================
     LOAD TABLE
  ========================= */

  loadForm2Table(): void {

    this.userService.loadForm2Table(1, 50).subscribe((res: any) => {

      console.log("FULL RESPONSE", res);

      const apiData = res?.data?.data;   // ✅ Correct

      console.log("Rows received:", apiData?.length);

      if (Array.isArray(apiData) && apiData.length > 0) {

        this.department_name = apiData[0].department_name;

        this.prepareRows(apiData);

      }
      else {

        this.tableRows = [];

      }

    });

  }
  /* =========================
     TRANSFORM DATA
  ========================= */

  private prepareRows(data: Form2ApiRow[]): void {

    this.tableRows = [];

    data.forEach(row => {

      const f3List = row.masterzone_societies || [];
      const f5List = row.selected_soc || [];
      const f6List = row.non_selected_soc || [];

      const totalRows = f3List.length;

      f3List.forEach((society, index) => {

        const isSelected =
          f5List.some(s => s.society_id === society.society_id);

        const isNonSelected =
          f6List.some(s => s.society_id === society.society_id);

        this.tableRows.push({

          district_name: row.district_name,
          zone_name: row.zone_name,

          f3_name: society.society_name,
          f5_name: isSelected ? society.society_name : null,
          f6_name: isNonSelected ? society.society_name : null,

          non_selected_count: index === 0 ? row.non_selected_count : undefined,
          remark: index === 0 ? row.remark : undefined,

          rowSpan: index === 0 ? totalRows : undefined

        });

      });

    });

  }

  /* =========================
     FILTER
  ========================= */

  applyFilter(): void {

    const deptId = this.departmentList
      .find(d => d.name === this.selectedDepartment)?.id;

    const distId = this.districtList
      .find(d => d.name === this.selectedDistrict)?.id;

    this.userService.loadForm2Filtered(deptId, distId)
      .subscribe((res: any) => {

        const apiData = res?.data?.data;

        if (Array.isArray(apiData)) {

          this.prepareRows(apiData);
          this.originalRows = [...this.tableRows];

        }
        else {

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

    this.loadForm2Table();

  }

  /* =========================
     EXPORT
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

    saveAs(new Blob([buffer]), 'Form2_Report.xlsx');

  }

}