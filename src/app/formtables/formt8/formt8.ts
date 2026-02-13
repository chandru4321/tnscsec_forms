import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { UserService } from '../../services/user';

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
  imports: [CommonModule],
  templateUrl: './formt8.html',
  styleUrls: ['./formt8.css']
})
export class Formt8 implements OnInit {

  department_name = '';
  tableRows: TableRow[] = [];

  constructor(private userService: UserService) { }

  ngOnInit(): void {
    this.loadForm8();
  }

  loadForm8(): void {
    this.userService.getForm8Table().subscribe(res => {

      if (!res?.success || !res.data?.length) return;

      const rows: TableRow[] = [];

      // Loop all form8 records (safe)
      res.data.forEach((form: any) => {

        const department = form.department?.name || '';
        const district = form.district?.name || '';
        const zone = form.zone?.name || '';

        // Set top header department (once)
        this.department_name = department;

        form.societies?.forEach((soc: any) => {

          const categories = soc.categories || [];

          // ---------- Helpers ----------
          const getNames = (type: string): string => {
            const cat = categories.find((c: any) => c.category === type);
            if (!cat?.winners?.length) return '-';
            return cat.winners.map((w: any) => w.member_name).join('\n');
          };

          const getCount = (type: string): number => {
            const cat = categories.find((c: any) => c.category === type);
            return cat?.winners?.length || 0;
          };

          const sc_count = getCount('SC_ST');
          const women_count = getCount('WOMEN');
          const general_count = getCount('GENERAL');

          // ---------- Push Row ----------
          rows.push({
            department_name: department,
            district_name: district,
            zone_name: zone,
            society_name: soc.society_name || '-',

            casted_votes: soc.casted_votes_count || 0,
            ballot_votes: soc.polling_details?.ballot_votes_at_counting || 0,
            valid_votes: soc.polling_details?.valid_votes || 0,
            invalid_votes: soc.polling_details?.invalid_votes || 0,

            sc_name: getNames('SC_ST'),
            women_name: getNames('WOMEN'),
            general_name: getNames('GENERAL'),

            sc_count,
            women_count,
            general_count,
            total_count: sc_count + women_count + general_count,

            remarks: soc.polling_details?.remarks || '-'
          });

        });

      });

      this.tableRows = rows;
    });
  }

  exportToExcel(): void {
    const table = document.getElementById('reportTable');
    if (!table) return;

    const ws = XLSX.utils.table_to_sheet(table);
    const wb = { Sheets: { Report: ws }, SheetNames: ['Report'] };

    const buffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    saveAs(new Blob([buffer]), 'Form8_Report.xlsx');
  }
}
