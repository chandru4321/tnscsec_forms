import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserService } from '../../services/user';
import * as XLSX from 'xlsx';
import { FormsModule } from '@angular/forms';
import { saveAs } from 'file-saver';
import { RouterModule } from '@angular/router';

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
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './table5.html',
  styleUrls: ['./table5.css']
})
export class Table5 implements OnInit {

  tableRows: TableRow[] = [];
  department_name = '';

  // Add these here
  selectedDepartment = '';
  selectedDistrict = '';

  departmentList: { id: number; name: string }[] = [];
  districtList: { id: number; name: string }[] = [];


  constructor(private userService: UserService) { }

  ngOnInit(): void {

    this.loadDepartments();
    this.loadDistricts();
    this.loadForm5();

  }

  loadForm5(): void {

    this.userService.loadForm5Filtered().subscribe({

      next: (res: any) => {

        console.log("FORM5 RESPONSE", res);

        const apiData = res?.data;

        if (res?.success && apiData) {

          this.department_name = apiData.department_name;

          this.prepareRows(apiData);

        } else {

          this.tableRows = [];

        }

      },

      error: err => console.error(err)

    });

  }
  private prepareRows(data: any): void {

    const members = data.data || [];

    const societyMap: any = {};

    members.forEach((m: any) => {

      const key = m.society_name;

      if (!societyMap[key]) {

        societyMap[key] = {
          district_name: data.district_name,   // <-- FIX
          zone_name: data.zone_name,           // <-- FIX
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
  applyFilter(): void {

    const deptId = this.departmentList.find(
      d => d.name === this.selectedDepartment
    )?.id;

    const distId = this.districtList.find(
      d => d.name === this.selectedDistrict
    )?.id;

    console.log("Department:", deptId);
    console.log("District:", distId);

    this.userService.loadForm5Filtered(deptId, distId)
      .subscribe((res: any) => {

        console.log(res);

        const apiData = res?.data;

        if (res?.success && apiData) {

          this.department_name = apiData.department_name;

          this.prepareRows(apiData);

        } else {

          this.tableRows = [];

        }

      });

  }
  loadDepartments(): void {

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

  loadDistricts(): void {

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

  downloadPdf(): void {

    const departmentId = this.departmentList.find(
      d => d.name === this.selectedDepartment
    )?.id;

    const districtId = this.districtList.find(
      d => d.name === this.selectedDistrict
    )?.id;

    console.log("Department:", departmentId);
    console.log("District:", districtId);

    this.userService
      .getForm5Pdf(departmentId, districtId)
      .subscribe({

        next: (res: Blob) => {

          saveAs(
            new Blob([res], { type: 'application/pdf' }),
            'Form5_Report.pdf'
          );

        },

        error: err => {

          console.error(err);

        }

      });

  }
}