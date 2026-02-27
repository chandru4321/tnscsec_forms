import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { UserService } from '../../services/user';
import { RouterModule } from "@angular/router";
import { FormsModule } from '@angular/forms';


/* =========================
   INTERFACES
========================= */

interface SelectedSociety {
  society_id: number;
  society_name: string;
  sc_st: number;
  women: number;
  general: number;
  tot_voters: number;
}

interface MasterzoneSociety {
  society_id: number;
  society_name: string;
}

interface Form1ApiRow {
  id: number;
  department_name: string;
  district_name: string;
  zone_name: string;
  masterzone_count: number;
  remark: string;
  non_selected_count: number;
  selected_soc: SelectedSociety[];
  masterzone_societies: MasterzoneSociety[];
}

interface TableRow {
  id: number;
  department_name: string;
  district_name: string;
  zone_name: string;
  masterzone_count: number;
  society_name: string;

  sc_st: number | null;
  women: number | null;
  general: number | null;
  tot_voters: number | null;

  isSelected: boolean;
  remark: string;

  rowSpan?: number;
  non_selected_count?: number;
}

/* =========================
   COMPONENT
========================= */

@Component({
  selector: 'app-formt1',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './table1.html',
  styleUrls: ['./table1.css']
})
export class Table1 implements OnInit {

  tableRows: TableRow[] = [];
  originalRows: TableRow[] = [];   // ✅ Keep original data

  department_name = '';

  // 🔽 Filter values
  // Selected values
  selectedDepartment: string = '';
  selectedDistrict: string = '';

  // Master lists
  departmentList: { id: number; name: string }[] = [];
  districtList: { id: number; name: string }[] = [];
  constructor(private userService: UserService) { }

  ngOnInit(): void {
    this.loadform1Tables();
    this.loadDepartments();
    this.loadDistricts();
  }


  loadDepartments(): void {
    this.userService.getdepartment().subscribe((res: any) => {
      if (res?.success && Array.isArray(res.data)) {
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
      if (res?.success && Array.isArray(res.data)) {
        this.districtList = res.data
          .filter((d: any) => d.is_active === 1)
          .map((d: any) => ({
            id: d.id,
            name: d.name.trim()
          }));
      }
    });
  }
  /* =========================
     LOAD API DATA
  ========================= */

  loadform1Tables(): void {
    this.userService.getForm1Table(1, 50).subscribe((res: any) => {

      console.log('Network Pagination:', res?.data?.pagination);

      const apiData = res?.data?.data?.data || res?.data?.data;

      console.log('Total records received:', apiData?.length);

      if (Array.isArray(apiData)) {
        this.prepareRows(apiData);
        this.originalRows = [...this.tableRows];
      }
    });
  }
  private prepareRows(data: Form1ApiRow[]): void {

    this.tableRows = [];

    data.forEach((row: any) => {

      // 🔹 Clean department & district names (important for filter match)
      const cleanDepartment = row.department_name
        ? row.department_name.replace(/\r?\n/g, ' ').trim()
        : '';

      const cleanDistrict = row.district_name
        ? row.district_name.trim()
        : '';

      const cleanZone = row.zone_name
        ? row.zone_name.trim()
        : '';

      // Combine selected + non-selected societies
      const allSocieties = [
        ...(row.selected_soc || []),
        ...(row.non_selected_soc || [])
      ];

      const selectedIds = new Set(
        (row.selected_soc || []).map((s: any) => s.society_id)
      );

      const totalRows = allSocieties.length;

      allSocieties.forEach((soc: any, index: number) => {

        const isSelected = selectedIds.has(soc.society_id);

        this.tableRows.push({
          id: row.id,
          department_name: cleanDepartment,   // ✅ cleaned
          district_name: cleanDistrict,       // ✅ cleaned
          zone_name: cleanZone,               // ✅ cleaned
          masterzone_count: row.selected_count + row.non_selected_count,
          society_name: soc.society_name,

          sc_st: isSelected ? soc.sc_st : null,
          women: isSelected ? soc.women : null,
          general: isSelected ? soc.general : null,
          tot_voters: isSelected ? soc.tot_voters : null,

          isSelected: isSelected,
          remark: row.remark,

          rowSpan: index === 0 ? totalRows : undefined,
          non_selected_count: index === 0 ? row.non_selected_count : undefined
        });

      });

    });

  }

  exportToExcel(): void {
    const table = document.getElementById('reportTable');

    if (!table) {
      console.error('Table not found');
      return;
    }

    const worksheet = XLSX.utils.table_to_sheet(table);
    const workbook = {
      Sheets: { Report: worksheet },
      SheetNames: ['Report']
    };

    const excelBuffer = XLSX.write(workbook, {
      bookType: 'xlsx',
      type: 'array'
    });

    const blob = new Blob([excelBuffer], {
      type: 'application/octet-stream'
    });

    saveAs(blob, 'Form1_Report.xlsx');
  }


  /* =========================
     CREATE FILTER LISTS
  
  /* =========================
     FILTER FUNCTION
  ========================= */
  applyFilter(): void {

    const deptId = this.departmentList
      .find(d => d.name === this.selectedDepartment)?.id;

    const distId = this.districtList
      .find(d => d.name === this.selectedDistrict)?.id;

    console.log('Filter Params:', deptId, distId);

    this.userService.getForm1Filtered(deptId, distId).subscribe((res: any) => {

      console.log('Filtered Response:', res);

      const apiData = res?.data?.data?.data || res?.data?.data;

      console.log('Filtered Form1 count:', apiData?.length);

      if (Array.isArray(apiData) && apiData.length > 0) {
        this.prepareRows(apiData);
        this.originalRows = [...this.tableRows];
      } else {
        this.tableRows = [];
        this.originalRows = [];
      }

    });
  }
  /* =========================
     CLEAR FILTER
  ========================= */
  clearFilter(): void {
    this.selectedDepartment = '';
    this.selectedDistrict = '';
    this.loadform1Tables();   // reload all data from backend
  }
}
