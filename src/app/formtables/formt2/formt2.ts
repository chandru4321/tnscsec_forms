import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { UserService } from '../../services/user';
import { RouterModule } from '@angular/router';

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
  selector: 'app-formt2',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './formt2.html',
  styleUrls: ['./formt2.css'] // ✅ reuse SAME CSS as Form-T1
})
export class Formt2 implements OnInit {
  department_name: string = '';


  tableRows: TableRow[] = [];

  constructor(private userService: UserService) { }

  ngOnInit(): void {
    this.loadForm2Table();
  }

  /* =========================
     LOAD API DATA
  ========================= */
  loadForm2Table(): void {
    this.userService.getForm2Table().subscribe({
      next: (res) => {

        if (res?.success && Array.isArray(res.data) && res.data.length > 0) {

          // 🔹 Get department name from first record
          this.department_name = res.data[0].department_name;

          this.prepareRows(res.data as Form2ApiRow[]);
        } else {
          this.tableRows = [];
        }

      },
      error: (err) => {
        console.error('API ERROR:', err);
      }
    });
  }



  /* =========================
     TRANSFORM API → TABLE
  ========================= */
  private prepareRows(data: Form2ApiRow[]): void {
    this.tableRows = [];

    data.forEach(row => {

      const f3List = row.masterzone_societies.map(s => s.society_name);
      const f5List = row.selected_soc.map(s => s.society_name);
      const f6List = row.non_selected_soc.map(s => s.society_name);

      const totalRows = f3List.length;

      f3List.forEach((society, index) => {

        this.tableRows.push({
          district_name: row.district_name,
          zone_name: row.zone_name,

          f3_name: society,
          f5_name: f5List.includes(society) ? society : null,
          f6_name: f6List.includes(society) ? society : null,

          non_selected_count: index === 0 ? row.non_selected_count : undefined,
          remark: index === 0 ? row.remark : undefined,
          rowSpan: index === 0 ? totalRows : undefined
        });

      });

    });
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

    saveAs(new Blob([buffer]), 'Form2_Report.xlsx');
  }
}
