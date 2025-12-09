import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../services/user';

@Component({
  selector: 'app-form1',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './form1.html',
  styleUrls: ['./form1.css']
})
export class Form1 implements OnInit {

  department_name: string = '';
  district_name: string = '';
  zone_name: string = '';

  masterZonesText: string = '';
  societyListText: string = '';
  plannedSocietiesCount: number | null = null;
  searchSocietyName: string = '';
  nonNotifiedSocieties: string = '';
  nonNotifiedCount: number | null = null;
  remarks: string = '';

  constructor(private userService: UserService) {}

  ngOnInit() {
    this.department_name = localStorage.getItem('department_name') || '';
    this.district_name = localStorage.getItem('district_name') || '';
    this.zone_name = localStorage.getItem('zone_name') || '';

    this.loadMasterZones();
    this.loadMasterZones12();
   // this.loadSocieties();
    //this.loadVoters();
  }

 
  

  loadMasterZones() {
  this.userService.getMasterZones().subscribe({
    next: (res) => {
      if (res.success && Array.isArray(res.data)) {
        this.masterZonesText = res.data
          .map((z: any) => z.association_name.replace(/\s+/g, ' ').trim())
          .join('\n\n');

        /** 🔥 Auto-fill count here */
        this.plannedSocietiesCount = res.data.length;
      }
    },
    error: (err) => console.error('Master Zones API Error:', err)
  });
}
masterZones12: { name: string; selected: boolean }[] = []; // ADD THIS

loadMasterZones12() {
  this.userService.getMasterZones().subscribe({
    next: (res) => {
      if (res.success && Array.isArray(res.data)) {

        this.masterZones12 = res.data.map((z: any) => ({
          name: z.association_name.trim(),
          selected: false  // checkbox default
        }));

      }
    },
    error: (err) => console.error('Master Zones API Error:', err)
  });
}
















































//   loadSocieties() {
//     this.userService.getSocieties().subscribe({
//       next: (res) => {
//         if (res.success && Array.isArray(res.data)) {
//           this.societyListText = res.data
//             .map((s: any) => s.society_name.replace(/\s+/g, ' ').trim())
//             .join('\n\n');
//         }
//       },
//       error: (err) => console.error('Societies API Error:', err)
//     });
//   }

//   loadVoters() {
//     this.userService.getVoters().subscribe({
//       next: (res) => {
//         if (res.success && Array.isArray(res.data)) {
//           // Example: could store voters if needed
//         }
//       },
//       error: (err) => console.error('Voters API Error:', err)
//     });
//   }

//   searchSociety() {
//     const filtered = this.societyListText
//       .split('\n\n')
//       .filter(s => s.toLowerCase().includes(this.searchSocietyName.toLowerCase()));
//     this.nonNotifiedSocieties = filtered.join('\n\n');
//   }

//   resetForm() {
//     this.plannedSocietiesCount = null;
//     this.searchSocietyName = '';
//     this.nonNotifiedSocieties = '';
//     this.nonNotifiedCount = null;
//     this.remarks = '';
//   }

//   submitForm() {
//     const payload = {
//       department_name: this.department_name,
//       district_name: this.district_name,
//       zone_name: this.zone_name,
//       masterZonesText: this.masterZonesText,
//       plannedSocietiesCount: this.plannedSocietiesCount,
//       nonNotifiedSocieties: this.nonNotifiedSocieties,
//       nonNotifiedCount: this.nonNotifiedCount,
//       remarks: this.remarks
//     };
//     console.log('Form submitted:', payload);
//     // Call service to save payload if needed
//   }

}