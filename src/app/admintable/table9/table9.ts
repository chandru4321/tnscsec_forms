import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { UserService } from '../../services/user';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-formt9',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './table9.html',
  styleUrls: ['./table9.css']
})
export class Table9 implements OnInit {

  department_name = '';
  tableRows: any[] = [];

  constructor(private userService: UserService) { }

  ngOnInit(): void {
    this.loadForm9();
  }

  loadForm9(): void {
    this.userService.getForm9List().subscribe(res => {

      if (!res?.success || !res.data?.length) return;

      const rows: any[] = [];

      res.data.forEach((form: any) => {

        const department = form.department?.name || '';
        const district = form.district?.name || '';
        const zone = form.zone?.name || '';

        // Set header department once
        this.department_name = department;

        form.societies?.forEach((soc: any) => {

          rows.push({
            district_name: district,
            zone_name: zone,
            society_name: soc.society_name || '-',

            // Final counts
            final_sc: soc.final_counts?.sc_st || 0,
            final_women: soc.final_counts?.women || 0,
            final_general: soc.final_counts?.general || 0,
            final_total: soc.final_counts?.total || 0,

            // Rejected counts
            rejected_sc: soc.rejected_counts?.sc_st || 0,
            rejected_women: soc.rejected_counts?.women || 0,
            rejected_general: soc.rejected_counts?.general || 0,
            rejected_total: soc.rejected_counts?.total || 0,

            // Withdrawn counts
            withdrawn_sc: soc.withdrawn_counts?.sc_st || 0,
            withdrawn_women: soc.withdrawn_counts?.women || 0,
            withdrawn_general: soc.withdrawn_counts?.general || 0,
            withdrawn_total: soc.withdrawn_counts?.total || 0,

            // Winner
            president_name: soc.president_winner?.member_name || '-',

            // Election type
            election_type: soc.election_type || '-'
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
    saveAs(new Blob([buffer]), 'Form9_Report.xlsx');
  }
}