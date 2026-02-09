import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../services/user';

@Component({
  selector: 'app-form8',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './form8.html',
  styleUrls: ['./form8.css']
})
export class Form8 implements OnInit {

  district_name = '';
  Zone_name = '';

  stoppedSocieties: any[] = [];

  constructor(private userService: UserService) { }

  ngOnInit(): void {
    this.district_name = localStorage.getItem('district_name') || '';
    this.Zone_name = localStorage.getItem('zone_name') || '';

    this.loadPreview();
  }

  loadPreview() {
    this.userService.getForm8Preview().subscribe((res: any) => {

      if (!res?.success) return;

      const stopped = res.data.stopped_elections;

      const rule52_18 = stopped.RULE_52_18 || [];
      const rule52A_6 = stopped.RULE_52A_6 || [];

      const allStopped = [...rule52_18, ...rule52A_6];

      // Remove duplicates
      const uniqueMap = new Map();
      allStopped.forEach((s: any) => {
        uniqueMap.set(s.society_id, s);
      });

      this.stoppedSocieties = Array.from(uniqueMap.values());
    });
  }
}
