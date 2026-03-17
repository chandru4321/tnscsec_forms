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

      const societies = item.active_societies || [];

      societies.forEach((soc: any) => {

        rows.push({

          district_name: item.district_id,
          zone_name: item.zone_id,
          society_name: soc.society_name,

          // Declared
          dec_sc: soc.declared?.sc_st || 0,
          dec_women: soc.declared?.women || 0,
          dec_general: soc.declared?.general || 0,
          dec_total: soc.declared?.total || 0,

          // Remaining
          rem_sc: soc.remaining_after_stop?.sc_st || 0,
          rem_women: soc.remaining_after_stop?.women || 0,
          rem_general: soc.remaining_after_stop?.general || 0,

          // Stopped Society Name
          stopped_society_name:
            soc.election_status === 'STOPPED'
              ? soc.society_name
              : '-'

        });

      });

    });

    this.tableRows = rows;
  }

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

    saveAs(new Blob([buffer]), 'Form5B_Report.xlsx');
  }
}