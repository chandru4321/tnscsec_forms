import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { UserService } from '../../services/user';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-formt9',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './table9.html',
  styleUrls: ['./table9.css']
})
export class Table9 implements OnInit {

  department_name = '';
  tableRows: any[] = [];

  selectedDepartment = '';
  selectedDistrict = '';

  departmentList: { id: number; name: string }[] = [];
  districtList: { id: number; name: string }[] = [];

  constructor(private userService: UserService) { }

  ngOnInit(): void {

    this.loadDepartments();
    this.loadDistricts();
    this.loadForm9();

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
  loadForm9(): void {

    this.userService.loadForm9Filtered().subscribe({

      next: (res: any) => {

        if (!res.success || !res.data?.length) {

          this.tableRows = [];
          return;

        }

        this.prepareRows(res.data);

      },

      error: err => console.error(err)

    });

  }
  prepareRows(data: any[]): void {

    const rows: any[] = [];

    data.forEach((form: any) => {

      const department =
        form.department_name ??
        form.department?.name ??
        '';

      const district =
        form.district_name ??
        form.district?.name ??
        '';

      const zone =
        form.zone_name ??
        form.zone?.name ??
        '';

      this.department_name = department;

      form.societies?.forEach((soc: any) => {

        rows.push({

          district_name: district,

          zone_name: zone,

          society_name: soc.society_name || '-',

          final_sc: soc.final_counts?.sc_st || 0,
          final_women: soc.final_counts?.women || 0,
          final_general: soc.final_counts?.general || 0,
          final_total: soc.final_counts?.total || 0,

          rejected_sc: soc.rejected_counts?.sc_st || 0,
          rejected_women: soc.rejected_counts?.women || 0,
          rejected_general: soc.rejected_counts?.general || 0,
          rejected_total: soc.rejected_counts?.total || 0,

          withdrawn_sc: soc.withdrawn_counts?.sc_st || 0,
          withdrawn_women: soc.withdrawn_counts?.women || 0,
          withdrawn_general: soc.withdrawn_counts?.general || 0,
          withdrawn_total: soc.withdrawn_counts?.total || 0,

          president_name: soc.president_winner?.member_name || '-',

          election_type: soc.election_type || '-'

        });

      });

    });

    this.tableRows = rows;

  }



  applyFilter(): void {

    const deptId = this.departmentList.find(
      d => d.name === this.selectedDepartment
    )?.id;

    const distId = this.districtList.find(
      d => d.name === this.selectedDistrict
    )?.id;

    this.userService.loadForm9Filtered(deptId, distId)
      .subscribe({

        next: (res: any) => {

          if (!res.success || !res.data?.length) {

            this.tableRows = [];
            return;

          }

          this.prepareRows(res.data);

        },

        error: err => console.error(err)

      });

  }
  downloadPdf(): void {

    const deptId = this.departmentList.find(
      d => d.name === this.selectedDepartment
    )?.id;

    const distId = this.districtList.find(
      d => d.name === this.selectedDistrict
    )?.id;

    this.userService.getForm9Pdf(deptId, distId)
      .subscribe({

        next: (res: Blob) => {

          saveAs(
            new Blob([res], { type: 'application/pdf' }),
            'Form9_Report.pdf'
          );

        },

        error: err => console.error(err)

      });

  }
}