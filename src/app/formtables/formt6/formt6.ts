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

          const withdrawScNames = soc.withdraw_scst_names?.join(', ') || '-';
          const withdrawWomenNames = soc.withdraw_women_names?.join(', ') || '-';
          const withdrawGeneralNames = soc.withdraw_general_names?.join(', ') || '-';

          const finalScNames = soc.final_scst_names?.join(', ') || '-';
          const finalWomenNames = soc.final_women_names?.join(', ') || '-';
          const finalGeneralNames = soc.final_general_names?.join(', ') || '-';

          const withdrawScCount = soc.withdraw_scst_names?.length || 0;
          const withdrawWomenCount = soc.withdraw_women_names?.length || 0;
          const withdrawGeneralCount = soc.withdraw_general_names?.length || 0;

          const isQualified = soc.election_status === 'QUALIFIED';
          const isUnopposed = soc.election_status === 'UNOPPOSED';
          const isUnqualified = soc.election_status === 'UNQUALIFIED';

          rows.push({
            district_name: district,
            zone_name: zone,
            society_name: soc.society_name || '-',

            // Withdrawal
            w_sc_name: withdrawScNames,
            w_women_name: withdrawWomenNames,
            w_general_name: withdrawGeneralNames,

            w_sc: withdrawScCount,
            w_women: withdrawWomenCount,
            w_general: withdrawGeneralCount,
            w_total:
              withdrawScCount +
              withdrawWomenCount +
              withdrawGeneralCount,

            // QUALIFIED → Final Candidate Section
            f_sc_name: isQualified ? finalScNames : '-',
            f_women_name: isQualified ? finalWomenNames : '-',
            f_general_name: isQualified ? finalGeneralNames : '-',

            f_sc: isQualified ? soc.final_sc_st : 0,
            f_women: isQualified ? soc.final_women : 0,
            f_general: isQualified ? soc.final_general : 0,
            f_total: isQualified ? soc.final_total : 0,

            // UNOPPOSED → Equal Section
            eq_sc_name: isUnopposed ? finalScNames : '-',
            eq_women_name: isUnopposed ? finalWomenNames : '-',
            eq_general_name: isUnopposed ? finalGeneralNames : '-',

            eq_sc: isUnopposed ? soc.final_sc_st : 0,
            eq_women: isUnopposed ? soc.final_women : 0,
            eq_general: isUnopposed ? soc.final_general : 0,
            eq_total: isUnopposed ? soc.final_total : 0,

            // UNQUALIFIED → Less Section
            less_sc_name: isUnqualified ? finalScNames : '-',
            less_women_name: isUnqualified ? finalWomenNames : '-',
            less_general_name: isUnqualified ? finalGeneralNames : '-',

            less_sc: isUnqualified ? soc.final_sc_st : 0,
            less_women: isUnqualified ? soc.final_women : 0,
            less_general: isUnqualified ? soc.final_general : 0,
            less_total: isUnqualified ? soc.final_total : 0,

            final_sc_name: '-',
            final_women_name: '-',
            final_general_name: '-',

            final_sc: 0,
            final_women: 0,
            final_general: 0,
            final_total: 0,

            rowSpan: 1
          });

        });
        this.tableRows = rows;

      },
      error: err => console.error("FORM6 ERROR:", err)
    });
  }
  downloadPdf(): void {

    const departmentId = 2;

    this.userService.getForm6Pdf(departmentId).subscribe(
      (res: Blob) => {

        saveAs(
          new Blob([res], { type: 'application/pdf' }),
          'Form6_Report.pdf'
        );

      },
      error => {
        console.error('PDF download error:', error);
      }
    );
  }
}