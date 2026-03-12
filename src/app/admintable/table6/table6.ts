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
  templateUrl: './table6.html',
  styleUrls: ['./table6.css']
})
export class Table6 implements OnInit {

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

        const apiData = res?.data;

        if (!res?.success || !apiData) {
          this.tableRows = [];
          return;
        }

        this.department_name = apiData.department_name || '';

        const district = apiData.district_name || '';
        const zone = apiData.zone_name || '';

        const societies = apiData.data || [];   // ✅ IMPORTANT

        const rows: TableRow[] = [];

        societies.forEach((soc: any) => {

          const candidates = soc.candidates || [];

          const filterBy = (cat: string, status?: string) =>
            candidates
              .filter((c: any) =>
                c.category_type === cat &&
                (!status || c.status === status)
              )
              .map((c: any) => c.member_name)
              .join('\n');

          const countBy = (cat: string, status?: string) =>
            candidates.filter((c: any) =>
              c.category_type === cat &&
              (!status || c.status === status)
            ).length;

          const isQualified = soc.election_status === 'QUALIFIED';
          const isUnopposed = soc.election_status === 'UNOPPOSED';
          const isUnqualified = soc.election_status === 'UNQUALIFIED';

          const w_sc = isUnqualified ? countBy('sc_st', 'WITHDRAWN') : 0;
          const w_women = isUnqualified ? countBy('women', 'WITHDRAWN') : 0;
          const w_general = isUnqualified ? countBy('general', 'WITHDRAWN') : 0;

          const f_sc = isQualified ? countBy('sc_st', 'ACTIVE') : 0;
          const f_women = isQualified ? countBy('women', 'ACTIVE') : 0;
          const f_general = isQualified ? countBy('general', 'ACTIVE') : 0;

          const eq_sc = isUnopposed ? countBy('sc_st', 'ACTIVE') : 0;
          const eq_women = isUnopposed ? countBy('women', 'ACTIVE') : 0;
          const eq_general = isUnopposed ? countBy('general', 'ACTIVE') : 0;

          rows.push({
            district_name: district,
            zone_name: zone,
            society_name: soc.society_name || '-',

            w_sc_name: isUnqualified ? filterBy('sc_st', 'WITHDRAWN') : '-',
            w_women_name: isUnqualified ? filterBy('women', 'WITHDRAWN') : '-',
            w_general_name: isUnqualified ? filterBy('general', 'WITHDRAWN') : '-',
            w_sc,
            w_women,
            w_general,
            w_total: w_sc + w_women + w_general,

            f_sc_name: isQualified ? filterBy('sc_st', 'ACTIVE') : '-',
            f_women_name: isQualified ? filterBy('women', 'ACTIVE') : '-',
            f_general_name: isQualified ? filterBy('general', 'ACTIVE') : '-',
            f_sc,
            f_women,
            f_general,
            f_total: f_sc + f_women + f_general,

            eq_sc_name: isUnopposed ? filterBy('sc_st', 'ACTIVE') : '-',
            eq_women_name: isUnopposed ? filterBy('women', 'ACTIVE') : '-',
            eq_general_name: isUnopposed ? filterBy('general', 'ACTIVE') : '-',
            eq_sc,
            eq_women,
            eq_general,
            eq_total: eq_sc + eq_women + eq_general,

            less_sc_name: '-',
            less_women_name: '-',
            less_general_name: '-',
            less_sc: 0,
            less_women: 0,
            less_general: 0,
            less_total: 0,

            final_sc_name: isQualified ? filterBy('sc_st', 'ACTIVE') : '-',
            final_women_name: isQualified ? filterBy('women', 'ACTIVE') : '-',
            final_general_name: isQualified ? filterBy('general', 'ACTIVE') : '-',
            final_sc: f_sc,
            final_women: f_women,
            final_general: f_general,
            final_total: f_sc + f_women + f_general,

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
