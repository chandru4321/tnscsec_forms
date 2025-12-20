import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../../services/user';

@Component({
  selector: 'app-form1edit',
  imports: [CommonModule, FormsModule],
  templateUrl: './form1edit.html',
  styleUrl: './form1edit.css',
})
export class Form1Edit implements OnInit {

  form1Id!: number;

  department_name = '';
  district_name = '';
  zone_name = '';

  masterZonesText = '';
  plannedSocietiesCount: number | null = null;

  masterZones12: { id: number; name: string; selected: boolean }[] = [];
  ruralDetails: { name: string; sc: number; women: number; general: number; total: number }[] = [];
  unselectedList: string[] = [];

  noteText = '';

  constructor(
    private route: ActivatedRoute,
    private userService: UserService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.form1Id = Number(this.route.snapshot.paramMap.get('id'));
    this.loadEditData();
  }

  /* =========================
     LOAD EXISTING DATA
  ========================= */
  loadEditData(): void {
    this.userService.getForm1Selected(this.form1Id).subscribe(res => {
      if (!res?.success) return;

      const d = res.data;

      this.department_name = d.department_name;
      this.district_name = d.district_name;
      this.zone_name = d.zone_name;
      this.noteText = d.remark || '';

      this.masterZonesText = d.masterzone_societies
        .map((x: any) => x.society_name)
        .join('\n\n');

      this.plannedSocietiesCount = d.masterzone_societies.length;

      // CHECKBOXES
      this.masterZones12 = d.masterzone_societies.map((m: any) => ({
        id: m.society_id,
        name: m.society_name,
        selected: d.selected_soc.some(
          (s: any) => s.society_id === m.society_id
        )
      }));

      // RURAL DETAILS
      this.ruralDetails = d.selected_soc.map((s: any) => ({
        name: s.society_name,
        sc: s.sc_st,
        women: s.women,
        general: s.general,
        total: s.tot_voters
      }));

      // UNSELECTED
      this.unselectedList = d.non_selected_soc.map(
        (n: any) => n.society_name
      );
    });
  }

  /* =========================
     UPDATE FORM
  ========================= */
  submitForm(): void {

    const selectedSoc = this.masterZones12
      .filter(x => x.selected)
      .map(z => ({ society_id: z.id }));

    const ruralDetails = this.ruralDetails.map(r => ({
      sc_st: r.sc,
      women: r.women,
      general: r.general,
      tot_voters: r.total
    }));

    const unselectedSoc = this.masterZones12
      .filter(x => !x.selected)
      .map(z => ({ society_id: z.id }));

    const payload = {
      remark: this.noteText,
      selected_soc: selectedSoc,
      non_selected_soc: unselectedSoc,
      rural_details: ruralDetails
    };

  }
}