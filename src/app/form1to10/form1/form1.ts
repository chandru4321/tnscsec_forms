import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../services/user';
import { Router, RouterLink } from "@angular/router";

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

  unselectedList: string[] = [];

  noteText:string = "";  // remark text

  constructor(private userService: UserService, private router : Router) {}


  ngOnInit() {
    this.department_name = localStorage.getItem('department_name') || '';
    this.district_name = localStorage.getItem('district_name') || '';
    this.zone_name = localStorage.getItem('zone_name') || '';

    this.loadMasterZones();
    this.loadMasterZonesCheckbox();
  }

  /** Load main zones text area */
  loadMasterZones() {
    this.userService.getMasterZones().subscribe(res => {
      if (res.success) {
        this.masterZonesText = res.data.map((x:any)=>x.association_name).join('\n\n');
        this.plannedSocietiesCount = res.data.length;
      }
    });
  }



  


  /** Checkbox list */
  loadMasterZonesCheckbox() {
    this.userService.getMasterZones().subscribe(res => {
      if (res.success) {
        this.masterZones12 = res.data.map((z:any)=>({
          id:z.id, name:z.association_name, selected:false
        }));
      }
    });
  }



  /** When checkbox changes → Load data */
  onCheckboxChange() {
    const selectedIDs = this.masterZones12.filter(x=>x.selected).map(x=>x.id);

    /** Store Unselected Names */
    this.unselectedList = this.masterZones12.filter(z=>!z.selected).map(z=>z.name);

    if(selectedIDs.length===0){
      this.ruralDetails=[];


      return;
    }

    const body = { associationIds:selectedIDs };


    this.userService.PostCheckpointZones(body).subscribe(res=>{
      if(res.success){

        this.ruralDetails=[];

        const list = res.data.non_selected_soc;
        const filtered = list.filter((x:any)=>selectedIDs.includes(x.id));

        filtered.forEach((soc:any)=> this.loadRuralDetail(soc.id, soc.association_name));
      }
    });
  }

  /** Get Rural Voter Counts from Backend */
  loadRuralDetail(id:number, name:string){
    const body = { associationIds:[id] };
    this.userService.getRuralSocietyDetails(body).subscribe(r=>{
      if(r.success && r.data.length>0){
        const d=r.data[0];
        this.ruralDetails.push({
          name,
          sc:d.sc_st,
          women:d.women,
          general:d.general,
          total:d.sc_st+d.women+d.general
        });
      }
    });
  }


  // FINAL SUBMIT ------->
  submitForm() {

  const selectedSoc = this.masterZones12
      .filter(x=>x.selected)
      .map(z=>({ id:z.id, association_name:z.name }));

  const ruralDetails = this.masterZones12
      .filter(x=>x.selected)
      .map(z=>{
        const r = this.ruralDetails.find(t => t.name === z.name);
        return {
          rurel_id: z.id,
          sc_st: r?.sc ?? 0,
          women: r?.women ?? 0,
          general: r?.general ?? 0,
          tot_voters:(r?.sc??0)+(r?.women??0)+(r?.general??0)
        };
      });

  const unselectedSoc = this.masterZones12
      .filter(x=>!x.selected)
      .map(z=>({ id:z.id, association_name:z.name }));

  const payload = {
    remark:this.noteText,
    selected_soc:selectedSoc,
    non_selected_soc:unselectedSoc,
    rural_details:ruralDetails
  };

  console.log("FINAL >>>>",payload);

  this.userService.submitForm1(payload).subscribe(res=>{
     alert("✔ Form Submitted Successfully");

     //  Redirect to Form1-10 Page After Submit
     this.router.navigate(['/layout/totalforms']);
  });
}
}




