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

  masterZonesText: string = '';  // textarea content

  constructor(private userService: UserService) {}

  ngOnInit() {

    // Load stored names
    this.department_name = localStorage.getItem('department_name') || '';
    this.district_name = localStorage.getItem('district_name') || '';
    this.zone_name = localStorage.getItem('zone_name') || '';

    // Load Master Zones list
    this.loadMasterZones();
  }

  loadMasterZones() {
    this.userService.getMasterZones().subscribe({
      next: (res) => {
        if (res.success && Array.isArray(res.data)) {

          // Convert array to text list inside textarea
          this.masterZonesText = res.data
            .map((z: any) => z.association_name)
            .join('\n');
        }
      },
      error: (err) => console.error("Master Zones API Error:", err)
    });
  }
}
