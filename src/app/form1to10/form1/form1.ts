import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../services/user';
import { Router, ActivatedRoute } from "@angular/router";

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

  masterZones12: { id: number; name: string; selected: boolean }[] = [];
  ruralDetails: { name: string; sc: number; women: number; general: number; total: number }[] = [];

  unselectedList: string[] = [];
  noteText = '';

  isEditMode = false;
  form1Id: number | null = null;

  constructor(
    private userService: UserService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {

    this.department_name = localStorage.getItem('department_name') || '';
    this.district_name = localStorage.getItem('district_name') || '';
    this.zone_name = localStorage.getItem('zone_name') || '';

    this.route.queryParams.subscribe(p => {
      if (p['id']) {
        this.form1Id = +p['id'];
        this.isEditMode = true;
        this.loadEditForm(this.form1Id);
      } else {
        this.loadMasterZones();
        this.loadMasterZonesCheckbox();
      }
    });
  }

  /* ================= ADD MODE ================= */

  loadMasterZones() {
    this.userService.getMasterZones().subscribe(res => {
      if (res.success) {
        this.masterZonesText = res.data.map((x: any) => x.association_name).join('\n\n');
        this.plannedSocietiesCount = res.data.length;
      }
    });
  }

  loadMasterZonesCheckbox() {
    this.userService.getMasterZones().subscribe(res => {
      if (res.success) {
        this.masterZones12 = res.data.map((z: any) => ({
          id: z.id, name: z.association_name, selected: false
        }));
      }
    });
  }

  /* ================= EDIT MODE ================= */

  loadEditForm(id: number) {

    // STEP 1 → Load all master zones for textarea & checkbox list
    this.userService.getMasterZones().subscribe(master => {

      this.masterZones12 = master.data.map((z: any) => ({
        id: z.id,
        name: z.association_name,
        selected: false
      }));

      this.masterZonesText = master.data.map((x: any) => x.association_name).join('\n\n');
      this.plannedSocietiesCount = master.data.length;

      // STEP 2 → Load edit record
      this.userService.getForm1ById(id).subscribe(res => {

        const d = res.data;
        console.log("EDIT selected_soc:", d.selected_soc);
        console.log("MASTER ZONES:", this.masterZones12);

        this.noteText = d.remark || '';

        // const selectedIds = d.selected_soc.map((x: any) => x.society_id);

        // // STEP 3 → mark selected societies
        // this.masterZones12 = this.masterZones12.map(z => ({
        //   ...z,
        //   selected: selectedIds.includes(z.id)
        // }));


        const selectedNames = d.selected_soc.map((x: any) => x.society_name.trim());

        this.masterZones12 = this.masterZones12.map(z => ({
          ...z,
          selected: selectedNames.includes(z.name.trim())
        }));














        // STEP 4 → load rural details
        this.ruralDetails = d.selected_soc.map((s: any) => ({
          name: s.society_name,
          sc: s.sc_st,
          women: s.women,
          general: s.general,
          total: s.tot_voters

        }));
      });
    });
  }



  onCheckboxChange() {

    const selectedIDs = this.masterZones12
      .filter(x => x.selected)
      .map(x => x.id);

    this.unselectedList = this.masterZones12
      .filter(z => !z.selected)
      .map(z => z.name);

    if (selectedIDs.length === 0) {
      this.ruralDetails = [];
      return;
    }

    const body = { associationIds: selectedIDs };

    this.userService.PostCheckpointZones(body).subscribe(res => {

      if (res.success) {

        this.ruralDetails = [];

        const list = res.data.non_selected_soc;
        const filtered = list.filter((x: any) => selectedIDs.includes(x.id));

        filtered.forEach((soc: any) =>
          this.loadRuralDetail(soc.id, soc.association_name)
        );
      }
    });
  }
  loadRuralDetail(id: number, name: string) {
    const body = { associationIds: [id] };

    this.userService.getRuralSocietyDetails(body).subscribe(r => {
      if (r.success && r.data.length > 0) {
        const d = r.data[0];
        this.ruralDetails.push({
          name,
          sc: d.sc_st,
          women: d.women,
          general: d.general,
          total: d.sc_st + d.women + d.general
        });
      }
    });
  }

  /* ================= SUBMIT ================= */

  submitForm() {

    const payload = {
      remark: this.noteText,

      selected_soc: this.masterZones12.filter(x => x.selected).map(z => ({
        id: z.id,
        association_name: z.name
      })),

      non_selected_soc: this.masterZones12.filter(x => !x.selected).map(z => ({
        id: z.id,
        association_name: z.name
      })),

      rural_details: this.masterZones12.filter(x => x.selected).map(z => {
        const r = this.ruralDetails.find(t => t.name === z.name);
        return {
          rurel_id: z.id,
          sc_st: r?.sc ?? 0,
          women: r?.women ?? 0,
          general: r?.general ?? 0,
          tot_voters: (r?.sc ?? 0) + (r?.women ?? 0) + (r?.general ?? 0)
        }
      })
    };




    if (this.isEditMode) {
      this.userService.editForm1(this.form1Id!, payload).subscribe(() => {
        alert("✔ Form Updated Successfully");
        this.router.navigate(['/layout/totalforms']);
      });

    } else {
      this.userService.submitForm1(payload).subscribe(() => {
        alert("✔ Form Submitted Successfully");
        this.router.navigate(['/layout/totalforms']);
      });
    }
  }
}
