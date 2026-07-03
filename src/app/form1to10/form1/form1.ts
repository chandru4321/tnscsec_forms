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

  isSubmitting = false;

  masterZonesText = '';
  plannedSocietiesCount: number | null = null;

  masterZones12: { id: number; name: string; selected: boolean }[] = [];
  ruralDetails: { name: string; sc: number; women: number; general: number; total: number }[] = [];

  unselectedList: string[] = [];
  noteText = '';

  isEditMode = false;
  form1Id: number | null = null;

  // 🔒 Prevent multiple checkbox API calls
  isLoadingDetails = false;

  constructor(
    private userService: UserService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  /* ================= INIT ================= */

  // ngOnInit() {


  //   this.department_name = localStorage.getItem('department_name') || '';
  //   this.district_name = localStorage.getItem('district_name') || '';
  //   this.zone_name = localStorage.getItem('zone_names') || '';

  //   this.route.queryParams.subscribe(p => {
  //     console.log('Query Params', p);

  //     if (p['id']) {
  //       this.form1Id = Number(p['id']);
  //       this.isEditMode = true;
  //       // this.loadEditForm(this.form1Id);
  //       this.loadEditableForm();
  //     } else {
  //       this.loadMasterZones();
  //       this.loadMasterZonesCheckbox();
  //     }
  //   });
  // }

  ngOnInit() {
    console.log('district_name=', localStorage.getItem('district_name'));
    console.log('zone_name=', localStorage.getItem('zone_name'));
    this.department_name = localStorage.getItem('department_name') || '';
    this.district_name = localStorage.getItem('district_name') || '';
    this.zone_name = localStorage.getItem('zone_name') || '';

    this.route.queryParams.subscribe(params => {

      // Edit from table
      if (params['id']) {

        this.form1Id = +params['id'];
        this.isEditMode = true;

        this.loadEditableForm();
      }
      else {

        // Fresh user or existing user
        const form1Completed = localStorage.getItem('form1_completed');

        if (form1Completed === 'true') {

          this.loadEditableForm();

        } else {

          this.loadMasterZones();
          this.loadMasterZonesCheckbox();

        }
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



  get selectedCount(): number {
    return this.masterZones12.filter(x => x.selected).length;
  }


  loadEditableForm() {

    this.userService.getEditableForm1().subscribe({

      next: (res) => {

        const d = res.data;

        this.noteText = d.remark || '';

        const selectedNames = d.selected_soc.map(
          (x: any) => x.society_name.trim()
        );

        this.userService.getMasterZones().subscribe(master => {

          this.masterZones12 = master.data.map((z: any) => ({
            id: z.id,
            name: z.association_name,
            selected: selectedNames.includes(
              z.association_name.trim()
            )
          }));

          this.plannedSocietiesCount = master.data.length;

          this.ruralDetails = d.selected_soc.map((s: any) => ({
            name: s.society_name,
            sc: s.sc_st,
            women: s.women,
            general: s.general,
            total: s.tot_voters
          }));

          this.unselectedList = d.non_selected_soc.map(
            (x: any) => x.society_name
          );
        });
      },

      error: () => {

        // New user -> load empty form
        this.loadMasterZones();
        this.loadMasterZonesCheckbox();
      }
    });
  }

  loadMasterZonesCheckbox() {
    this.userService.getMasterZones().subscribe(res => {
      if (res.success) {
        this.masterZones12 = res.data.map((z: any) => ({
          id: z.id,
          name: z.association_name,
          selected: false
        }));
      }
    });
  }

  /* ================= EDIT MODE ================= */


  /* ================= CHECKBOX ================= */

  onCheckboxChange() {

    // 🔒 Stop if already loading (prevents double click issue)
    if (this.isLoadingDetails) return;

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

    this.isLoadingDetails = true;

    const body = { associationIds: selectedIDs };

    this.userService.PostCheckpointZones(body).subscribe(res => {

      // Clear before reloading (avoids accumulation)
      this.ruralDetails = [];

      if (res.success) {

        const filtered = res.data.non_selected_soc
          .filter((x: any) => selectedIDs.includes(x.id));

        filtered.forEach((soc: any) => {
          this.loadRuralDetail(soc.id, soc.association_name);
        });
      }

      this.isLoadingDetails = false;
    }, () => {
      this.isLoadingDetails = false;
    });
  }

  /* ================= LOAD DETAILS ================= */

  loadRuralDetail(id: number, name: string) {

    // 🔒 Prevent duplicate before API
    if (this.ruralDetails.some(r => r.name === name)) {
      return;
    }

    const body = { associationIds: [id] };

    this.userService.getRuralSocietyDetails(body).subscribe(r => {
      if (r.success && r.data.length > 0) {
        const d = r.data[0];

        // 🔒 Double protection (API race condition)
        if (!this.ruralDetails.some(x => x.name === name)) {
          this.ruralDetails.push({
            name,
            sc: d.sc_st,
            women: d.women,
            general: d.general,
            total: d.sc_st + d.women + d.general
          });
        }
      }
    });
  }




  cancel() {
    this.router.navigate(['/layout/totalforms']);
  }


  /* ================= SUBMIT ================= */

  submitForm() {

    const payload = {
      remark: this.noteText,

      selected_soc: this.masterZones12
        .filter(x => x.selected)
        .map(z => ({
          id: z.id,
          association_name: z.name
        })),

      non_selected_soc: this.masterZones12
        .filter(x => !x.selected)
        .map(z => ({
          id: z.id,
          association_name: z.name
        })),

      rural_details: this.masterZones12
        .filter(x => x.selected)
        .map(z => {
          const r = this.ruralDetails.find(t => t.name === z.name);
          return {
            rurel_id: z.id,
            sc_st: r?.sc ?? 0,
            women: r?.women ?? 0,
            general: r?.general ?? 0,
            tot_voters: (r?.sc ?? 0) + (r?.women ?? 0) + (r?.general ?? 0)
          };
        })
    };

    /* ===== EDIT MODE ===== */
    //     if (this.isEditMode) {

    //       this.userService.editForm1(this.form1Id!, payload).subscribe(() => {

    //         localStorage.setItem('form1_id', this.form1Id!.toString());
    //         localStorage.setItem('form1_completed', 'true');

    //         alert("✔ Form Updated Successfully");
    //         this.router.navigate(['/layout/form2']);
    //       });

    //     }
    //     /* ===== ADD MODE ===== */
    //     else {

    //       this.userService.submitForm1(payload).subscribe((res: any) => {

    //         if (res.success) {

    //           localStorage.setItem('form1_id', res.data.id);
    //           localStorage.setItem('form1_completed', 'true');

    //           localStorage.setItem('district_name', this.district_name);
    //           localStorage.setItem('zone_name', this.zone_name);

    //           alert("✔ Form Submitted Successfully");
    //           this.router.navigate(['/layout/totalforms']);
    //         }
    //       });
    //     }
    //   }
    // }

    /* ===== EDIT MODE ===== */
    if (this.isEditMode) {

      this.userService.editForm1(this.form1Id!, payload).subscribe(() => {

        localStorage.setItem('form1_id', this.form1Id!.toString());
        localStorage.setItem('form1_completed', 'true');

        alert("✔ Form Updated Successfully");
        this.router.navigate(['/layout/form2']);
      });

    }
    /* ===== ADD MODE ===== */
    else {

      this.userService.submitForm1(payload).subscribe((res: any) => {

        if (res.success) {

          localStorage.setItem('form1_id', res.data.id);
          localStorage.setItem('form1_completed', 'true');

          localStorage.setItem('district_name', this.district_name);
          localStorage.setItem('zone_name', this.zone_name);

          alert("✔ Form Submitted Successfully");
          this.router.navigate(['/layout/totalforms']);
        }
      });
    }
  }
}

