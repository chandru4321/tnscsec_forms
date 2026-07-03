import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserService } from '../../services/user';
import { saveAs } from 'file-saver';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

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
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './table4.html',
  styleUrls: ['./table4.css']
})
export class Table4 implements OnInit {

  tableRows: TableRow[] = [];
  department_name = '';
  selectedDepartment = '';
  selectedDistrict = '';

  departmentList: any[] = [];
  districtList: any[] = [];

  constructor(private userService: UserService) { }

  ngOnInit(): void {

    this.loadForm4();

    this.loadDepartments();

    this.loadDistricts();

  }

  loadForm4(): void {
    const selectedDepartment = this.selectedDepartment
    console.log(selectedDepartment)
    const selectedDistrict = this.selectedDistrict
    this.userService.getForm4Table(selectedDepartment, selectedDistrict).subscribe({
      next: (res: any) => {

        console.log('FORM4 RESPONSE', res);

        const apiData = res?.data?.data;


        if (
          res?.success &&
          Array.isArray(apiData) &&
          apiData.length > 0
        ) {

          // Department Header
          this.department_name =
            apiData[0]?.department?.name || '';

          this.prepareRows(apiData);

        } else {

          this.tableRows = [];

        }

      },
      error: (err) => {
        console.error('FORM4 API ERROR:', err);
      }
    });
  }

  private prepareRows(data: any[]): void {

    const rows: TableRow[] = [];

    data.forEach((item: any) => {

      const societies = [
        ...(item.filed_societies || []),
        ...(item.unfiled_societies || [])
      ];

      const span = societies.length || 1;

      societies.forEach((soc: any, index: number) => {

        const rural = soc.rural_counts || {};
        const declared = soc.declared_counts || {};

        rows.push({

          district_name: item.district?.name || '-',

          zone_name: item.zone?.name || '-',

          society_name: soc.society_name || '-',

          // Rural Counts
          rural_sc: rural.sc_st || 0,
          rural_women: rural.women || 0,
          rural_general: rural.general || 0,
          rural_total: rural.total || 0,

          // Declared Counts
          dec_sc: declared.sc_st || 0,
          dec_women: declared.women || 0,
          dec_general: declared.general || 0,
          dec_total: declared.total || 0,

          // Unqualified Society
          rejected:
            soc.election_status === 'UNQUALIFIED'
              ? soc.society_name
              : '-',

          rowSpan: index === 0 ? span : 0

        });

      });

      // No societies case
      if (societies.length === 0) {

        rows.push({

          district_name: item.district?.name || '-',

          zone_name: item.zone?.name || '-',

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

    console.log('FORM4 TABLE ROWS:', this.tableRows);
  }



  loadDepartments() {
    this.userService.getdepartment().subscribe((res: any) => {
      if (res?.success) {
        this.departmentList = res.data
          .filter((d: any) => d.is_active === 1)
          .map((d: any) => ({
            id: d.id,
            name: d.name.trim()
          }));
      }
    });
  }

  loadDistricts() {
    this.userService.getdistrict().subscribe((res: any) => {
      if (res?.success) {
        this.districtList = res.data
          .filter((d: any) => d.is_active === 1)
          .map((d: any) => ({
            id: d.id,
            name: d.name.trim()
          }));
      }
    });
  }

  applyFilter(): void {

    const deptId = this.departmentList
      .find(d => d.name === this.selectedDepartment)?.id;

    const distId = this.districtList
      .find(d => d.name === this.selectedDistrict)?.id;

    console.log('Department ID:', deptId);
    console.log('District ID:', distId);

    this.userService.loadForm4Filtered(deptId, distId)
      .subscribe((res: any) => {

        console.log('FILTER RESPONSE:', res);

        const apiData = res?.data?.data;

        console.log('FILTER DATA:', apiData);

        if (Array.isArray(apiData) && apiData.length > 0) {

          this.department_name = apiData[0]?.department?.name || '';
          this.prepareRows(apiData);

        } else {

          console.log('NO DATA RETURNED');

          this.tableRows = [];

        }

      });

  }



  downloadPdf(): void {

    const departmentId = Number(this.selectedDepartment);
    const districtId = Number(this.selectedDistrict);

    console.log('Department ID:', departmentId);
    console.log('District ID:', districtId);

    this.userService.getForm4Pdf(departmentId, districtId).subscribe(
      (res: Blob) => {

        saveAs(
          new Blob([res], { type: 'application/pdf' }),
          'Form4_Report.pdf'
        );

      },
      error => {
        console.error('PDF download error:', error);
      }
    );
  }
}