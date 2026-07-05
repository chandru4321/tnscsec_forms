import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { UserService } from '../../services/user';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

interface TableRow {
  department_name: string;
  district_name: string;
  zone_name: string;
  society_name: string;

  casted_votes: number;
  ballot_votes: number;
  valid_votes: number;
  invalid_votes: number;

  sc_name: string;
  women_name: string;
  general_name: string;

  sc_count: number;
  women_count: number;
  general_count: number;
  total_count: number;

  remarks: string;
}

@Component({
  selector: 'app-formt8',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './table8.html',
  styleUrls: ['./table8.css']
})
export class Table8 implements OnInit {

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
    this.loadForm8();

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

  loadForm8(): void {

    this.userService.loadForm8Filtered().subscribe({

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

    const rows: TableRow[] = [];

    data.forEach((form: any) => {

      // Read values from the API correctly
      const department = form.department_name || '';
      const district = form.district_name || '';
      const zone = form.zone_name || '';

      this.department_name = department;

      form.societies?.forEach((soc: any) => {

        const categories = soc.categories || [];

        const getNames = (type: string): string => {
          const cat = categories.find((c: any) => c.category === type);

          return cat?.winners?.length
            ? cat.winners.map((w: any) => w.member_name).join('\n')
            : '-';
        };

        const getCount = (type: string): number => {
          const cat = categories.find((c: any) => c.category === type);
          return cat?.winners?.length || 0;
        };

        const sc = getCount('SC_ST');
        const women = getCount('WOMEN');
        const general = getCount('GENERAL');

        rows.push({

          department_name: department,

          district_name: district,

          zone_name: zone,      // <-- fixed

          society_name: soc.society_name || '-',

          casted_votes: soc.casted_votes_count || 0,

          ballot_votes: soc.polling_details?.ballot_votes_at_counting || 0,

          valid_votes: soc.polling_details?.valid_votes || 0,

          invalid_votes: soc.polling_details?.invalid_votes || 0,

          sc_name: getNames('SC_ST'),

          women_name: getNames('WOMEN'),

          general_name: getNames('GENERAL'),

          sc_count: sc,

          women_count: women,

          general_count: general,

          total_count: sc + women + general,

          remarks: soc.polling_details?.remarks || '-'

        });

      });

    });

    this.tableRows = rows;

    console.log(this.tableRows);

  }

  applyFilter(): void {

    const deptId = this.departmentList.find(
      d => d.name === this.selectedDepartment
    )?.id;

    const distId = this.districtList.find(
      d => d.name === this.selectedDistrict
    )?.id;

    this.userService.loadForm8Filtered(deptId, distId)
      .subscribe({

        next: (res: any) => {

          if (!res.success || !res.data?.length) {

            this.tableRows = [];
            return;

          }

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

    this.userService.getForm8Pdf(deptId, distId)
      .subscribe({

        next: (res: Blob) => {

          saveAs(
            new Blob([res], { type: 'application/pdf' }),
            'Form8_Report.pdf'
          );

        }

      });

  }
}