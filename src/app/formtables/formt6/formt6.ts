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
    this.userService.getForm6Table().subscribe(res => {
      if (!res?.success) return;

      const data = res.data;

      this.department_name = data.department?.name || '';

      const district = data.district?.name || '';
      const zone = data.zone?.name || '';

      const rows: TableRow[] = [];

      data.societies.forEach((soc: any) => {

        const candidates = soc.candidates || [];

        // helper
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

        // ======================
        // f1 – UNQUALIFIED + WITHDRAWN
        // ======================
        const f1Applicable = soc.election_status === 'UNQUALIFIED';

        const w_sc_name = f1Applicable ? filterBy('sc_st', 'WITHDRAWN') : '-';
        const w_women_name = f1Applicable ? filterBy('women', 'WITHDRAWN') : '-';
        const w_general_name = f1Applicable ? filterBy('general', 'WITHDRAWN') : '-';

        const w_sc = f1Applicable ? countBy('sc_st', 'WITHDRAWN') : 0;
        const w_women = f1Applicable ? countBy('women', 'WITHDRAWN') : 0;
        const w_general = f1Applicable ? countBy('general', 'WITHDRAWN') : 0;

        // ======================
        // f2 – QUALIFIED
        // ======================
        const isQualified = soc.election_status === 'QUALIFIED';

        const f_sc_name = isQualified ? filterBy('sc_st', 'ACTIVE') : '-';
        const f_women_name = isQualified ? filterBy('women', 'ACTIVE') : '-';
        const f_general_name = isQualified ? filterBy('general', 'ACTIVE') : '-';

        const f_sc = isQualified ? soc.final_counts?.sc_st || 0 : 0;
        const f_women = isQualified ? soc.final_counts?.women || 0 : 0;
        const f_general = isQualified ? soc.final_counts?.general || 0 : 0;
        const f_total = isQualified ? soc.final_counts?.total || 0 : 0;

        // ======================
        // f3 – UNOPPOSED
        // ======================
        const isUnopposed = soc.election_status === 'UNOPPOSED';

        const eq_sc_name = isUnopposed ? filterBy('sc_st', 'ACTIVE') : '-';
        const eq_women_name = isUnopposed ? filterBy('women', 'ACTIVE') : '-';
        const eq_general_name = isUnopposed ? filterBy('general', 'ACTIVE') : '-';

        const eq_sc = isUnopposed ? countBy('sc_st', 'ACTIVE') : 0;
        const eq_women = isUnopposed ? countBy('women', 'ACTIVE') : 0;
        const eq_general = isUnopposed ? countBy('general', 'ACTIVE') : 0;

        // ======================
        // f4 – UNQUALIFIED ACTIVE
        // ======================
        const less_sc_name = f1Applicable ? filterBy('sc_st', 'ACTIVE') : '-';
        const less_women_name = f1Applicable ? filterBy('women', 'ACTIVE') : '-';
        const less_general_name = f1Applicable ? filterBy('general', 'ACTIVE') : '-';

        const less_sc = f1Applicable ? countBy('sc_st', 'ACTIVE') : 0;
        const less_women = f1Applicable ? countBy('women', 'ACTIVE') : 0;
        const less_general = f1Applicable ? countBy('general', 'ACTIVE') : 0;

        // ======================
        // f5 – same as qualified final list
        // ======================
        // F5 = QUALIFIED ACTIVE members
        const final_sc_name = isQualified ? filterBy('sc_st', 'ACTIVE') : '-';
        const final_women_name = isQualified ? filterBy('women', 'ACTIVE') : '-';
        const final_general_name = isQualified ? filterBy('general', 'ACTIVE') : '-';

        const final_sc = isQualified ? countBy('sc_st', 'ACTIVE') : 0;
        const final_women = isQualified ? countBy('women', 'ACTIVE') : 0;
        const final_general = isQualified ? countBy('general', 'ACTIVE') : 0;
        const final_total = final_sc + final_women + final_general;

        rows.push({
          district_name: district,
          zone_name: zone,
          society_name: soc.society_name,

          w_sc_name,
          w_women_name,
          w_general_name,
          w_sc,
          w_women,
          w_general,
          w_total: w_sc + w_women + w_general,

          f_sc_name,
          f_women_name,
          f_general_name,
          f_sc,
          f_women,
          f_general,
          f_total,

          eq_sc_name,
          eq_women_name,
          eq_general_name,
          eq_sc,
          eq_women,
          eq_general,
          eq_total: eq_sc + eq_women + eq_general,

          less_sc_name,
          less_women_name,
          less_general_name,
          less_sc,
          less_women,
          less_general,
          less_total: less_sc + less_women + less_general,

          final_sc_name,
          final_women_name,
          final_general_name,
          final_sc: f_sc,
          final_women: f_women,
          final_general: f_general,
          final_total: f_total,

          rowSpan: 1
        });

      });

      this.tableRows = rows;
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
