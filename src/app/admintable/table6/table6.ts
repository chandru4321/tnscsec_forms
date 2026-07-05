import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { UserService } from '../../services/user';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

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
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './table6.html',
  styleUrls: ['./table6.css']
})
export class Table6 implements OnInit {

  department_name = '';
  tableRows: TableRow[] = [];
  selectedDepartment = '';
  selectedDistrict = '';

  departmentList: { id: number; name: string }[] = [];
  districtList: { id: number; name: string }[] = [];

  constructor(private userService: UserService) { }

  ngOnInit(): void {

    this.loadDepartments();
    this.loadDistricts();
    this.loadForm6();

  }

  private prepareRows(apiData: any): void {

    const rows: TableRow[] = [];

    const forms = apiData.data || [];

    forms.forEach((item: any) => {

      const district = item.district_name;
      const zone = item.zone_name;

      (item.societies || []).forEach((soc: any) => {

        rows.push({

          district_name: district,
          zone_name: zone,
          society_name: soc.society_name,

          // Withdrawn
          w_sc_name: (soc.withdraw_scst_names || []).join('\n'),
          w_women_name: (soc.withdraw_women_names || []).join('\n'),
          w_general_name: (soc.withdraw_general_names || []).join('\n'),

          w_sc: (soc.withdraw_scst_names || []).length,
          w_women: (soc.withdraw_women_names || []).length,
          w_general: (soc.withdraw_general_names || []).length,
          w_total:
            (soc.withdraw_scst_names || []).length +
            (soc.withdraw_women_names || []).length +
            (soc.withdraw_general_names || []).length,

          // Final Candidates
          f_sc_name: (soc.final_scst_names || []).join('\n'),
          f_women_name: (soc.final_women_names || []).join('\n'),
          f_general_name: (soc.final_general_names || []).join('\n'),

          f_sc: soc.final_sc_st || 0,
          f_women: soc.final_women || 0,
          f_general: soc.final_general || 0,
          f_total: soc.final_total || 0,

          // Equal (if required later)
          eq_sc_name: '-',
          eq_women_name: '-',
          eq_general_name: '-',

          eq_sc: 0,
          eq_women: 0,
          eq_general: 0,
          eq_total: 0,

          // Less
          less_sc_name: '-',
          less_women_name: '-',
          less_general_name: '-',

          less_sc: 0,
          less_women: 0,
          less_general: 0,
          less_total: 0,

          // Final
          final_sc_name: (soc.final_scst_names || []).join('\n'),
          final_women_name: (soc.final_women_names || []).join('\n'),
          final_general_name: (soc.final_general_names || []).join('\n'),

          final_sc: soc.final_sc_st || 0,
          final_women: soc.final_women || 0,
          final_general: soc.final_general || 0,
          final_total: soc.final_total || 0,

          rowSpan: 1

        });

      });

    });

    this.tableRows = rows;

  }
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

  applyFilter(): void {

    const deptId = this.departmentList.find(
      d => d.name === this.selectedDepartment
    )?.id;

    const distId = this.districtList.find(
      d => d.name === this.selectedDistrict
    )?.id;

    this.userService.loadForm6Filtered(deptId, distId)
      .subscribe({

        next: (res: any) => {

          const apiData = res?.data;

          if (!res?.success || !apiData) {

            this.tableRows = [];
            return;

          }

          this.department_name = apiData.department_name || '';

          this.prepareRows(apiData);

        },

        error: err => console.error(err)

      });

  }

  loadForm6(): void {

    this.userService.getForm6Table().subscribe({

      next: (res: any) => {

        console.log(res);

        if (!res.success) {
          this.tableRows = [];
          return;
        }

        this.department_name = '';

        this.prepareRows(res.data);

      }

    });

  }
  downloadPdf(): void {

    const deptId = this.departmentList.find(
      d => d.name === this.selectedDepartment
    )?.id;

    const distId = this.districtList.find(
      d => d.name === this.selectedDistrict
    )?.id;

    this.userService.getForm6Pdf(deptId, distId)
      .subscribe({

        next: (res: Blob) => {

          saveAs(
            new Blob([res], { type: 'application/pdf' }),
            'Form6_Report.pdf'
          );

        },

        error: err => console.error(err)

      });

  }
}