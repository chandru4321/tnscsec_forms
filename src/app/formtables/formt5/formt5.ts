import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserService } from '../../services/user';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

interface TableRow {
  district_name: string;
  zone_name: string;
  society_name: string;

  sc_names: string;
  women_names: string;
  general_names: string;

  sc_count: number;
  women_count: number;
  general_count: number;
}

@Component({
  selector: 'app-formt5',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './formt5.html',
  styleUrls: ['./formt5.css']
})
export class Formt5 implements OnInit {

  tableRows: TableRow[] = [];
  department_name = '';

  constructor(private userService: UserService) { }

  ngOnInit(): void {
    this.loadForm5();
  }

  loadForm5(): void {
    this.userService.getForm5Table().subscribe({
      next: (res) => {
        if (res?.success && res.data) {
          this.department_name = res.data.department_name;
          this.prepareRows(res.data);
        }
      },
      error: err => console.error(err)
    });
  }

  private prepareRows(data: any): void {

    const members = data.members || [];

    // Group by society
    const societyMap: any = {};

    members.forEach((m: any) => {
      const key = m.society_name;

      if (!societyMap[key]) {
        societyMap[key] = {
          district_name: data.district_name,
          zone_name: data.zone_name,
          society_name: key,
          sc: [],
          women: [],
          general: []
        };
      }

      if (m.category_type === 'sc_st') {
        societyMap[key].sc.push(m.member_name);
      }
      else if (m.category_type === 'women') {
        societyMap[key].women.push(m.member_name);
      }
      else if (m.category_type === 'general') {
        societyMap[key].general.push(m.member_name);
      }
    });

    // Convert to table rows
    this.tableRows = Object.values(societyMap).map((s: any) => ({
      district_name: s.district_name,
      zone_name: s.zone_name,
      society_name: s.society_name,

      sc_names: s.sc.join('<br>'),
      women_names: s.women.join('<br>'),
      general_names: s.general.join('<br>'),

      sc_count: s.sc.length,
      women_count: s.women.length,
      general_count: s.general.length
    }));
  }

  exportToExcel(): void {
    const table = document.getElementById('reportTable');
    if (!table) return;

    const ws = XLSX.utils.table_to_sheet(table);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Form5');

    const buffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    saveAs(new Blob([buffer]), 'Form5_Report.xlsx');
  }
}
