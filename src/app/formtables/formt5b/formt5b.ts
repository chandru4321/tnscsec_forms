import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserService } from '../../services/user';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';



@Component({
  selector: 'app-formt5b',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './formt5b.html',
  styleUrls: ['./formt5b.css']
})
export class Formt5b implements OnInit {

  tableRows: any[] = [];
  department_name = '';

  constructor(private userService: UserService) { }

  ngOnInit(): void {
    this.loadForm5B();
  }

  loadForm5B(): void {
    this.userService.getForm5blisttable().subscribe({
      next: (res) => {

        console.log("FORM5B RESPONSE:", res);

        const apiData = res?.data?.data;

        if (res?.success && apiData?.length > 0) {

          this.prepareRows(apiData);

        } else {
          this.tableRows = [];
        }

      },
      error: err => console.error(err)
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

    const departmentId = 2;

    this.userService.getForm5bPdf(departmentId).subscribe(
      (res: Blob) => {

        saveAs(
          new Blob([res], { type: 'application/pdf' }),
          'Form5B_Report.pdf'
        );

      },
      error => {
        console.error('PDF download error:', error);
      }
    );
  }
}