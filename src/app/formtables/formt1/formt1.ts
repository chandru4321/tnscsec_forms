import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { UserService } from '../../services/user';

@Component({
  selector: 'app-formt1',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './formt1.html',
  styleUrls: ['./formt1.css']
})
export class Formt1 implements OnInit {

  form1List: any[] = [];
  departmentName = '';

  constructor(private userService: UserService) {}

  ngOnInit() {
    this.loadForm1Table();
  }

  /** 🔵 Load API data */
  loadForm1Table() {
    this.userService.getForm1Table().subscribe(res => {
      if (res?.success && Array.isArray(res.data)) {
        this.form1List = res.data;

        // Show department name in header (from first row)
        this.departmentName = res.data[0]?.department_name || '';
      }
    });
  }

  /** 🔢 SUM helper */
  sumField(list: any[], field: string): number {
    if (!Array.isArray(list)) return 0;
    return list.reduce((sum, item) => sum + (Number(item[field]) || 0), 0);
  }

  /** ✏️ Dummy edit */
  onEdit() {
    alert('Edit clicked (Dummy action)');
  }

  /** ⬇️ Export Excel */
  exportToExcel() {
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

    saveAs(new Blob([buffer]), 'Form1_Report.xlsx');
  }
}
