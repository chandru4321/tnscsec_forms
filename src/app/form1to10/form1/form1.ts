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

  department_name = '';
  district_name = '';
  zone_name = '';

  masterZonesText = '';
  plannedSocietiesCount: number | null = null;

  masterZones12: { id:number; name:string; selected:boolean }[] = [];
  ruralDetails: { name:string; sc:number; women:number; general:number; total:number }[] = [];

  /** 🔥 Added missing variable */
  unselectedList: string[] = [];

  constructor(private userService: UserService) {}

  ngOnInit() {
    this.department_name = localStorage.getItem('department_name') || '';
    this.district_name = localStorage.getItem('district_name') || '';
    this.zone_name = localStorage.getItem('zone_name') || '';

    this.loadMasterZones();
    this.loadMasterZonesCheckbox();
  }

  /** Load Master Zones Left Display */
  loadMasterZones() {
    this.userService.getMasterZones().subscribe(res => {
      if (res.success) {
        this.masterZonesText = res.data.map((x:any)=>x.association_name).join('\n\n');
        this.plannedSocietiesCount = res.data.length;
      }
    });
  }

  /** Load Checkboxes */
  loadMasterZonesCheckbox() {
    this.userService.getMasterZones().subscribe(res => {
      if (res.success) {
        this.masterZones12 = res.data.map((z:any)=>({
          id: z.id, 
          name: z.association_name, 
          selected:false
        }));
      }
    });
  }

  /** Checkbox → Call API */
  onCheckboxChange() {

    const selectedIDs = this.masterZones12.filter(x => x.selected).map(x => x.id);

    /** 🔥 Store unselected checkboxes for H4 display */
    this.unselectedList = this.masterZones12
        .filter(z => !z.selected)
        .map(z => z.name);

    if (selectedIDs.length === 0) {
      this.ruralDetails = [];
      return;
    }

    const body = { associationIds:selectedIDs };

    this.userService.PostCheckpointZones(body).subscribe(res => {
      if (res.success) {

        this.ruralDetails = [];

        const list = res.data.non_selected_soc;
        const filtered = list.filter((x:any)=> selectedIDs.includes(x.id));

        filtered.forEach((soc:any)=> this.loadRuralDetail(soc.id, soc.association_name));
      }
    });
  }

  /** Load rural data for each selected society */
  loadRuralDetail(id:number, name:string) {

    const body = { associationIds:[id] };

    this.userService.getRuralSocietyDetails(body).subscribe(r=>{
      if(r.success && r.data.length > 0){

        const d = r.data[0];

        this.ruralDetails.push({
          name,
          sc:d.sc_st,
          women:d.women,
          general:d.general,
          total:d.sc_st + d.women + d.general
        });
      }
    });
  }
}
