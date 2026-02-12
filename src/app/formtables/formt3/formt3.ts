import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserService } from '../../services/user';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

interface TableRow {
  district_name: string;
  zone_name: string;
  society_name: string;
  ass_memlist: number | null;
  ero_claim: string;
  jcount: number;
  rcount: number;
  tot_voters: number | null;
  rowSpan?: number;
}

@Component({
  selector: 'app-formt3',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './formt3.html',
  styleUrls: ['./formt3.css']
})
export class Formt3 implements OnInit {

  tableRows: TableRow[] = [];
  department_name = '';

  constructor(private userService: UserService) { }

  ngOnInit(): void {
    this.loadForm3();
  }

  loadForm3(): void {
    this.userService.getForm3Table().subscribe(res => {
      if (res?.success && res.data?.length) {
        this.department_name = res.data[0].department_name;
        this.prepareRows(res.data);
      }
    });
  }

  private prepareRows(data: any[]): void {
    const rows: TableRow[] = [];

    data.forEach(item => {
      const societies = item.societies || [];
      const span = societies.length;

      societies.forEach((soc: any, index: number) => {
        rows.push({
          district_name: item.district_name,
          zone_name: item.zone_name,
          society_name: soc.society_name,
          ass_memlist: soc.ass_memlist,
          ero_claim:
            soc.ero_claim === 1 ? 'ஆம்' :
              soc.ero_claim === 0 ? 'இல்லை' : '-',
          jcount: soc.jcount || 0,
          rcount: soc.rcount || 0,
          tot_voters: soc.tot_voters,
          rowSpan: index === 0 ? span : 0
        });
      });
    });

    this.tableRows = rows;
  }

  /* Excel Export */
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
