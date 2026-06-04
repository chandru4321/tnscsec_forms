import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { UserService } from '../../services/user';

@Component({
  selector: 'app-formt10',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './formt10.html',
  styleUrls: ['./formt10.css']
})
export class Formt10 implements OnInit {

  department_name = '';
  tableRows: any[] = [];

  constructor(private userService: UserService) { }

  ngOnInit(): void {
    this.loadForm10();
  }

  loadForm10(): void {
    this.userService.getForm10List().subscribe(res => {

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

  downloadPdf(): void {

    const departmentId = 2;

    this.userService.getForm10Pdf(departmentId).subscribe(
      (res: Blob) => {

        saveAs(
          new Blob([res], { type: 'application/pdf' }),
          'Form10_Report.pdf'
        );

      },
      error => {
        console.error('PDF download error:', error);
      }
    );
  }
}