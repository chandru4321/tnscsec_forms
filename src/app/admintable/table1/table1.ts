import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { UserService } from '../../services/user';
import { RouterModule } from "@angular/router";

/* =========================
   INTERFACES
========================= */

interface SelectedSociety {
  society_id: number;
  society_name: string;
  sc_st: number;
  women: number;
  general: number;
  tot_voters: number;
}

interface MasterzoneSociety {
  society_id: number;
  society_name: string;
}

interface Form1ApiRow {
  id: number;
  department_name: string;
  district_name: string;
  zone_name: string;
  masterzone_count: number;
  remark: string;
  non_selected_count: number;
  selected_soc: SelectedSociety[];
  masterzone_societies: MasterzoneSociety[];
}

interface TableRow {
  id: number;
  department_name: string;
  district_name: string;
  zone_name: string;
  masterzone_count: number;
  society_name: string;

  sc_st: number | null;
  women: number | null;
  general: number | null;
  tot_voters: number | null;

  isSelected: boolean;
  remark: string;

  rowSpan?: number;
  non_selected_count?: number;
}

/* =========================
   COMPONENT
========================= */

@Component({
  selector: 'app-formt1',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './table1.html',
  styleUrls: ['./table1.css']
})
export class Table1 implements OnInit {

  tableRows: TableRow[] = [];
  department_name = '';   // Header use (optional)

  constructor(private userService: UserService) { }

  ngOnInit(): void {
    this.loadform1Tables();
  }

  /* =========================
     LOAD API DATA
  ========================= */
  loadform1Tables(): void {
    this.userService.getform1tables().subscribe((res: any) => {

      // ✅ Correct path: res.data.data
      const apiData = res?.data?.data;

      if (res?.success && Array.isArray(apiData)) {

        // Header
        if (apiData.length > 0) {
          this.department_name = apiData[0].department_name;
        }

        this.prepareRows(apiData as Form1ApiRow[]);
      } else {
        this.tableRows = [];
      }

    });
  }

  /* =========================
     TRANSFORM API → TABLE
  ========================= */
  private prepareRows(data: any[]): void {
    this.tableRows = [];

    data.forEach((row: any) => {

      // Combine selected + non-selected societies
      const allSocieties = [
        ...(row.selected_soc || []),
        ...(row.non_selected_soc || [])
      ];

      const selectedIds = new Set(
        (row.selected_soc || []).map((s: any) => s.society_id)
      );

      const totalRows = allSocieties.length;

      allSocieties.forEach((soc: any, index: number) => {

        const isSelected = selectedIds.has(soc.society_id);

        this.tableRows.push({
          id: row.id,
          department_name: row.department_name,
          district_name: row.district_name,
          zone_name: row.zone_name,
          masterzone_count: row.selected_count + row.non_selected_count,
          society_name: soc.society_name,

          sc_st: isSelected ? soc.sc_st : null,
          women: isSelected ? soc.women : null,
          general: isSelected ? soc.general : null,
          tot_voters: isSelected ? soc.tot_voters : null,

          isSelected: isSelected,
          remark: row.remark,

          rowSpan: index === 0 ? totalRows : undefined,
          non_selected_count: index === 0 ? row.non_selected_count : undefined
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

    saveAs(new Blob([buffer]), 'Form1_Report.xlsx');
  }

  /* =========================
     DUMMY EDIT
  ========================= */
  onEdit(): void {
    alert('Edit clicked');
  }
}
