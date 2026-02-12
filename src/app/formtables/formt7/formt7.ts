import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { CommonModule } from '@angular/common';
import { UserService } from '../../services/user';

@Component({
  selector: 'app-formt7',
  templateUrl: './formt7.html',
  styleUrl: './formt7.css',
  imports: [CommonModule],
  standalone: true,
})
export class Formt7 implements OnInit {

  // Old content kept (not removed)
  baseUrl = 'YOUR_API_BASE_URL';

  form7Data: any;
  societies: any[] = [];

  constructor(
    private userservice: UserService,
    private http: HttpClient   // kept because old code uses it
  ) { }

  ngOnInit(): void {
    console.log('Form7 loaded');
    this.getForm7Table();
  }

  // API CALL (Fixed to use UserService)
  getForm7Table() {
    this.userservice.getForm7Table().subscribe({
      next: (res: any) => {
        console.log('Form7 Response:', res);
        this.form7Data = res.data;
        this.societies = this.form7Data?.societies || [];
      },
      error: (err) => {
        console.error('Form7 Error:', err);
      }
    });
  }

  // Rural values
  getRuralValue(society: any, type: string) {
    return society.rural?.[type] || 0;
  }

  // Declared values only if eligible = true
  getDeclaredValue(society: any, type: string) {
    const cat = society.qualified_categories?.[type];
    return cat && cat.eligible ? cat.count : 0;
  }

  getDeclaredTotal(society: any) {
    let total = 0;
    ['sc_st', 'women', 'general'].forEach(type => {
      const cat = society.qualified_categories?.[type];
      if (cat && cat.eligible) {
        total += cat.count;
      }
    });
    return total;
  }

  // Excel Export
  exportToExcel(): void {
    const table = document.getElementById('reportTable');
    if (!table) return;

    const ws = XLSX.utils.table_to_sheet(table);
    const wb = { Sheets: { Report: ws }, SheetNames: ['Report'] };

    const buffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    saveAs(new Blob([buffer]), 'Form7_Report.xlsx');
  }
}
