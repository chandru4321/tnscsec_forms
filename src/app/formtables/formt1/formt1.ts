import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { UserService } from '../../services/user';
import { RouterLink, RouterModule } from "@angular/router";

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
  district_name: string;
  zone_name: string;
  masterzone_count: number;
  remark: string;
  non_selected_count: number;
  selected_soc: SelectedSociety[];
  masterzone_societies: MasterzoneSociety[];
}

interface TableRow {
  id: number;   // 🔥 ADD THIS

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
  templateUrl: './formt1.html',
  styleUrls: ['./formt1.css']

})
export class Formt1 implements OnInit {

  tableRows: TableRow[] = [];

  constructor(private userService: UserService) { }

  ngOnInit(): void {
    this.loadForm1Table();
  }

  /* =========================
     LOAD API DATA
  ========================= */
  loadForm1Table(): void {
    this.userService.getForm1Table().subscribe(res => {
      if (res?.success && Array.isArray(res.data)) {
        this.prepareRows(res.data as Form1ApiRow[]);
      }
    });
  }

  /* =========================
     TRANSFORM API → TABLE
  ========================= */
  private prepareRows(data: Form1ApiRow[]): void {
    this.tableRows = [];

    data.forEach((row: any) => {

      const selectedMap = new Map<number, SelectedSociety>(
        row.selected_soc.map((s: any) => [s.society_id, s])
      );

      const totalRows = row.masterzone_societies.length;

      row.masterzone_societies.forEach((mz: any, index: number) => {

        const selected = selectedMap.get(mz.society_id);
        const isSelected = !!selected; // ✅ KEY LINE

        this.tableRows.push({
          id: row.id,

          district_name: row.district_name,
          zone_name: row.zone_name,
          masterzone_count: row.masterzone_count,
          society_name: mz.society_name,

          // ✅ numbers only for selected
          sc_st: isSelected ? selected!.sc_st : null,
          women: isSelected ? selected!.women : null,
          general: isSelected ? selected!.general : null,
          tot_voters: isSelected ? selected!.tot_voters : null,

          isSelected: isSelected, // ✅ FIXED
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
    alert('Edit clicked (Dummy action)');
  }
}
