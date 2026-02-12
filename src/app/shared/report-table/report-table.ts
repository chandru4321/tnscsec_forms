import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import * as XLSX from 'xlsx';
import * as FileSaver from 'file-saver';

@Component({
  selector: 'app-report-table',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './report-table.html',
  styleUrls: ['./report-table.css']
})
export class ReportTableComponent {

  @Input() title: string = '';
  @Input() departmentName: string = '';

  @Input() groupHeaders: any[] = [];     // Level 1
  @Input() subHeaders: any[] = [];       // Level 2 (NEW)
  @Input() columns: any[] = [];          // Final columns
  @Input() data: any[] = [];

  get totalColumns(): number {
    return this.columns.length;
  }


  // Export Excel (Common for all Forms)
  exportExcel(): void {

    // Prepare header row
    const headers = this.columns.map(col => col.header);

    // Prepare data rows
    const rows = this.data.map((row, index) => {
      const obj: any = {};
      this.columns.forEach(col => {
        if (col.type === 'index') {
          obj[col.header] = index + 1;
        } else {
          obj[col.header] = row[col.field] ?? '';
        }
      });
      return obj;
    });

    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(rows, { header: headers });
    const workbook: XLSX.WorkBook = {
      Sheets: { 'Report': worksheet },
      SheetNames: ['Report']
    };

    const excelBuffer: any = XLSX.write(workbook, {
      bookType: 'xlsx',
      type: 'array'
    });

    const blob: Blob = new Blob([excelBuffer], {
      type: 'application/octet-stream'
    });

    FileSaver.saveAs(blob, `${this.title}.xlsx`);
  }
}
