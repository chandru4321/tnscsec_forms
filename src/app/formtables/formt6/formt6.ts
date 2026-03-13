import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { UserService } from '../../services/user';

interface TableRow {
  district_name: string;
  zone_name: string;
  society_name: string;

  // f1
  w_sc_name: string;
  w_women_name: string;
  w_general_name: string;
  w_sc: number;
  w_women: number;
  w_general: number;
  w_total: number;

  // f2
  f_sc_name: string;
  f_women_name: string;
  f_general_name: string;
  f_sc: number;
  f_women: number;
  f_general: number;
  f_total: number;

  // f3
  eq_sc_name: string;
  eq_women_name: string;
  eq_general_name: string;
  eq_sc: number;
  eq_women: number;
  eq_general: number;
  eq_total: number;

  // f4
  less_sc_name: string;
  less_women_name: string;
  less_general_name: string;
  less_sc: number;
  less_women: number;
  less_general: number;
  less_total: number;

  // f5
  final_sc_name: string;
  final_women_name: string;
  final_general_name: string;
  final_sc: number;
  final_women: number;
  final_general: number;
  final_total: number;

  rowSpan?: number;
}

@Component({
  selector: 'app-formt6',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './formt6.html',
  styleUrls: ['./formt6.css']
})
export class Formt6 implements OnInit {

  department_name = '';
  tableRows: TableRow[] = [];

  constructor(private userService: UserService) { }

  ngOnInit(): void {
    this.loadForm6();
  }

  loadForm6(): void {
    this.userService.getForm6Table().subscribe({
      next: (res) => {

        console.log("FORM6 RESPONSE:", res);

        const apiData = res?.data?.data;

        if (!res?.success || !Array.isArray(apiData) || apiData.length === 0) {
          this.tableRows = [];
          return;
        }

        const main = apiData[0];

        this.department_name = main.department_name || '';

        const district = main.district_name || '';
        const zone = main.zone_name || '';

        const societies = main.societies || [];

        const rows: TableRow[] = [];

        societies.forEach((soc: any) => {

          const counts = soc.final_counts || {};

          rows.push({
            district_name: district,
            zone_name: zone,
            society_name: soc.society_name || '-',

            w_sc_name: '-',
            w_women_name: '-',
            w_general_name: '-',
            w_sc: 0,
            w_women: 0,
            w_general: 0,
            w_total: 0,

            f_sc_name: '-',
            f_women_name: '-',
            f_general_name: '-',
            f_sc: counts.sc_st || 0,
            f_women: counts.women || 0,
            f_general: counts.general || 0,
            f_total: counts.total || 0,

            eq_sc_name: '-',
            eq_women_name: '-',
            eq_general_name: '-',
            eq_sc: 0,
            eq_women: 0,
            eq_general: 0,
            eq_total: 0,

            less_sc_name: '-',
            less_women_name: '-',
            less_general_name: '-',
            less_sc: 0,
            less_women: 0,
            less_general: 0,
            less_total: 0,

            final_sc_name: '-',
            final_women_name: '-',
            final_general_name: '-',
            final_sc: counts.sc_st || 0,
            final_women: counts.women || 0,
            final_general: counts.general || 0,
            final_total: counts.total || 0,

            rowSpan: 1
          });

        });

        this.tableRows = rows;

      },
      error: err => console.error("FORM6 ERROR:", err)
    });
  }
  exportToExcel(): void {
    const table = document.getElementById('reportTable');
    if (!table) return;

    const ws = XLSX.utils.table_to_sheet(table);
    const wb = { Sheets: { Report: ws }, SheetNames: ['Report'] };

    const buffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    saveAs(new Blob([buffer]), 'Form6_Report.xlsx');
  }
}
