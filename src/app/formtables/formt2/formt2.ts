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
  id: number;

  department_name: string;
  district_name: string;
  zone_name: string;

  masterzone_societies: string[];
  selected_soc: string[];
  non_selected_soc: string[];

  non_selected_count: number;
  remark: string;
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
        console.log('FULL API RESPONSE:', res);
        console.log('DATA:', res?.data);

        if (res?.success && Array.isArray(res.data) && res.data.length > 0) {
          this.prepareRows(res.data as Form2ApiRow[]);
        } else {
          console.warn('No data received for Form2');
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
    this.tableRows = data.map(row => ({
      id: row.id,

      department_name: row.department_name,
      district_name: row.district_name,
      zone_name: row.zone_name,

      masterzone_societies: row.masterzone_societies.map(s => s.society_name),
      selected_soc: row.selected_soc.map(s => s.society_name),
      non_selected_soc: row.non_selected_soc.map(s => s.society_name),

      non_selected_count: row.non_selected_count,
      remark: row.remark
    }));
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
