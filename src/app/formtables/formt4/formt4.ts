import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserService } from '../../services/user';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';


interface TableRow {
  district_name: string;
  zone_name: string;
  society_name: string;

  rural_sc: number;
  rural_women: number;
  rural_general: number;
  rural_total: number;

  dec_sc: number;
  dec_women: number;
  dec_general: number;
  dec_total: number;

  rejected: string;
  rowSpan?: number;
}

@Component({
  selector: 'app-formt4',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './formt4.html',
  styleUrls: ['./formt4.css']
})
export class Formt4 implements OnInit {

  tableRows: TableRow[] = [];
  department_name = '';

  constructor(private userService: UserService) { }

  ngOnInit(): void {
    this.loadForm4();
  }





  loadForm4(): void {
    this.userService.getForm4Table().subscribe({
      next: (res) => {
        if (res?.success && res.data?.length) {
          this.department_name = res.data[0].department_name;
          this.prepareRows(res.data);
        }
      },
      error: err => console.error(err)
    });
  }

  private prepareRows(data: any[]): void {
    const rows: TableRow[] = [];

    data.forEach(item => {

      const societies = [
        ...(item.filed_societies || []),
        ...(item.unfiled_societies || [])
      ];

      const span = societies.length || 1;

      societies.forEach((soc: any, index: number) => {

        const rural = soc.rural || {};
        const declared = soc.declared || {};

        rows.push({
          district_name: item.district_name,
          zone_name: item.zone_name,
          society_name: soc.society_name || '-',

          rural_sc: rural.sc_st || 0,
          rural_women: rural.women || 0,
          rural_general: rural.general || 0,
          rural_total: rural.total || 0,

          dec_sc: declared.sc_st || 0,
          dec_women: declared.women || 0,
          dec_general: declared.general || 0,
          dec_total: declared.total || 0,

          rejected:
            soc.election_status === 'UNQUALIFIED'
              ? soc.society_name
              : '-',

          rowSpan: index === 0 ? span : 0
        });
      });

      // if no societies
      if (societies.length === 0) {
        rows.push({
          district_name: item.district_name,
          zone_name: item.zone_name,
          society_name: '-',

          rural_sc: 0,
          rural_women: 0,
          rural_general: 0,
          rural_total: 0,

          dec_sc: 0,
          dec_women: 0,
          dec_general: 0,
          dec_total: 0,

          rejected: '-',
          rowSpan: 1
        });
      }

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

    saveAs(new Blob([buffer]), 'Form3_Report.xlsx');
  }
}

