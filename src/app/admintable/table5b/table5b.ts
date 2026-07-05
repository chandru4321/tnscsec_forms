import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user';
import { saveAs } from 'file-saver';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-table5b',
  imports: [CommonModule, FormsModule],
  templateUrl: './table5b.html',
  styleUrl: './table5b.css',
})
export class table5b implements OnInit {

  tableRows: any[] = [];
  department_name = '';
  selectedDepartment = '';
  selectedDistrict = '';

  departmentList: { id: number; name: string }[] = [];
  districtList: { id: number; name: string }[] = [];

  constructor(private userService: UserService) { }

  ngOnInit(): void {

    this.loadDepartments();

    this.loadDistricts();

    this.loadForm5B();

  }

  loadDepartments(): void {

    this.userService.getdepartment().subscribe((res: any) => {

      if (res.success) {

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

      if (res.success) {

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

    const deptId = this.departmentList
      .find(d => d.name === this.selectedDepartment)?.id;

    const distId = this.districtList
      .find(d => d.name === this.selectedDistrict)?.id;

    this.userService.loadForm5bFiltered(deptId, distId)
      .subscribe((res: any) => {

        const apiData = res?.data?.data;

        if (res.success && apiData) {

          this.prepareRows(apiData);

        }
        else {

          this.tableRows = [];

        }

      });

  }
  loadForm5B(): void {

    this.userService.loadForm5bFiltered().subscribe({

      next: (res: any) => {

        console.log("FORM5B RESPONSE:", res);

        const apiData = res?.data?.data;

        if (res?.success && apiData?.length > 0) {

          this.prepareRows(apiData);

        } else {

          this.tableRows = [];

        }

      },

      error: (err: any) => {

        console.error(err);

      }

    });

  }

  private prepareRows(data: any[]): void {

    const rows: any[] = [];

    data.forEach(item => {

      this.department_name = item.department_name || '';

      /* ACTIVE SOCIETIES */
      const activeSocieties = item.active_societies || [];

      activeSocieties.forEach((soc: any) => {

        rows.push({

          district_name: item.district_name || '',
          zone_name: item.zone_name || '',
          society_name: soc.society_name || '',

          // Declared
          dec_sc: soc.declared?.sc_st || 0,
          dec_women: soc.declared?.women || 0,
          dec_general: soc.declared?.general || 0,
          dec_total: soc.declared?.total || 0,

          // Remaining
          rem_sc: soc.remaining_after_stop?.sc_st || 0,
          rem_women: soc.remaining_after_stop?.women || 0,
          rem_general: soc.remaining_after_stop?.general || 0,

          // Don't show stopped society here
          stopped_society_name: '-'

        });

      });

      /* STOPPED / UNQUALIFIED SOCIETIES */
      const stoppedSocieties = item.stopped_societies || [];

      stoppedSocieties.forEach((soc: any) => {

        rows.push({

          district_name: item.district_name || '',
          zone_name: item.zone_name || '',
          society_name: soc.society_name || '',

          dec_sc: soc.declared?.sc_st || 0,
          dec_women: soc.declared?.women || 0,
          dec_general: soc.declared?.general || 0,
          dec_total: soc.declared?.total || 0,

          rem_sc: 0,
          rem_women: 0,
          rem_general: 0,

          // Show stopped society name only here
          stopped_society_name: soc.society_name || '-'

        });

      });

    });

    this.tableRows = rows;

    console.log('TABLE ROWS:', this.tableRows);
  }
  downloadPdf(): void {

    const deptId = this.departmentList
      .find(d => d.name === this.selectedDepartment)?.id;

    const distId = this.districtList
      .find(d => d.name === this.selectedDistrict)?.id;

    this.userService.getForm5bPdf(deptId, distId)
      .subscribe({

        next: (res: Blob) => {

          saveAs(
            new Blob([res], { type: 'application/pdf' }),
            'Form5B_Report.pdf'
          );

        },

        error: err => console.error(err)

      });

  }
}
