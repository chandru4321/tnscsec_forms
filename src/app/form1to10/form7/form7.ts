import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../services/user';

@Component({
  selector: 'app-form7',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './form7.html',
  styleUrls: ['./form7.css']
})
export class Form7 implements OnInit {

  district_name = '';
  Zone_name = '';

  // F3 – Rural counts
  f3Societies: any[] = [];

  // F4 – Eligible counts
  f4Societies: any[] = [];

  // F5 – Final input table
  f5Data: any[] = [];

  constructor(private userService: UserService) { }

  ngOnInit(): void {
    this.district_name = localStorage.getItem('district_name') || '';
    this.Zone_name = localStorage.getItem('zone_name') || '';
    this.loadPreview();
  }

  /* ================= PREVIEW ================= */
  loadPreview() {
    this.userService.getForm7Preview().subscribe(res => {
      if (!res?.success) return;

      const societies = res.data.societies;

      // Remove duplicates
      const uniqueMap = new Map();
      societies.forEach((s: any) => {
        uniqueMap.set(s.society_id, s);
      });

      const uniqueSocieties = Array.from(uniqueMap.values());

      /* ================= F3 ================= */
      this.f3Societies = uniqueSocieties.map((s: any) => ({
        society_id: s.society_id,
        society_name: s.society_name,
        sc_st: +s.rural.sc_st,
        women: +s.rural.women,
        general: +s.rural.general,
        total: +s.rural.total_voters
      }));

      /* ================= F4 ================= */
      this.f4Societies = uniqueSocieties.map((s: any) => {

        const scst = s.qualified_categories.sc_st;
        const women = s.qualified_categories.women;
        const general = s.qualified_categories.general;

        const sc_st_count = scst.eligible ? scst.count : 0;
        const women_count = women.eligible ? women.count : 0;
        const general_count = general.eligible ? general.count : 0;

        return {
          society_id: s.society_id,
          society_name: s.society_name,
          sc_st: sc_st_count,
          women: women_count,
          general: general_count,
          total: sc_st_count + women_count + general_count
        };
      });

      /* ================= F5 ================= */
      this.f5Data = this.f4Societies.map(f4 => ({
        society_id: f4.society_id,
        society_name: f4.society_name,

        final_sc_st_count: f4.sc_st,
        final_women_count: f4.women,
        final_general_count: f4.general,

        // Total voters from F4
        form3_total: f4.total,

        // User inputs
        casted_votes_count: 0,
        voting_percentage: 0,
        ballot_box_count: 0,
        stamp_count: 0,
        polling_stations_count: 0,
        election_officers_count: 0,

        // 🔥 Single rule field
        polling_suspension_count: 'NO_ISSUES'
      }));
    });
  }

  /* ================= RULE SELECT ================= */
  setRule(row: any, rule: string, event: any) {
    if (event.target.checked) {
      row.polling_suspension_count = rule;
    } else {
      row.polling_suspension_count = 'NO_ISSUES';
    }
  }

  /* ================= AUTO % ================= */
  calculatePercentage(row: any) {
    if (row.form3_total > 0) {
      row.voting_percentage =
        ((row.casted_votes_count / row.form3_total) * 100).toFixed(2);
    } else {
      row.voting_percentage = 0;
    }
  }

  /* ================= CANCEL ================= */
  onCancel() {
    if (confirm('உறுதியாக ரத்து செய்யவா?')) {
      this.loadPreview();
    }
  }

  /* ================= SUBMIT ================= */
  onSubmit() {

    const payload = {
      societies: this.f5Data.map(row => ({

        society_id: row.society_id,
        society_name: row.society_name,

        final_sc_st_count: row.final_sc_st_count,
        final_women_count: row.final_women_count,
        final_general_count: row.final_general_count,

        form3_total: row.form3_total,
        casted_votes_count: row.casted_votes_count,
        voting_percentage: Number(row.voting_percentage),

        ballot_box_count: row.ballot_box_count,
        stamp_count: row.stamp_count,
        polling_stations_count: row.polling_stations_count,
        election_officers_count: row.election_officers_count,

        polling_suspension_count: row.polling_suspension_count
      }))
    };

    console.log('Form7 Payload:', payload);

    this.userService.submitForm7(payload).subscribe({
      next: (res: any) => {
        if (res?.success) {
          alert('Form 7 வெற்றிகரமாக சமர்ப்பிக்கப்பட்டது');
        }
      },
      error: () => {
        alert('Form 7 சமர்ப்பிப்பதில் பிழை ஏற்பட்டது');
      }
    });
  }
}
