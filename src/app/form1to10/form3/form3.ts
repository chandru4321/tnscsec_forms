import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../services/user';
import { Router, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-form3',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './form3.html',
  styleUrls: ['./form3.css']
})
export class Form3 implements OnInit {

  district_name = '';
  zone_name = '';

  form1_id!: number;
  form2_id!: number;

  isEditMode = false;
  form3Id: number | null = null;

  // F3 society list (IMPORTANT: object list)
  f3SocietyList: {
    society_id: number;
    society_name: string;
  }[] = [];

  // F4
  voterCounts: number[] = [];

  // F5
  f5Answers: ('YES' | 'NO')[] = [];

  // F6
  removedCounts: number[] = [];
  remainingCounts: number[] = [];


  memberCounts: number[] = [];   // From API (readonly)

  constructor(private userService: UserService, private router: Router

  ) { }

  ngOnInit(): void {

    this.district_name = localStorage.getItem('district_name') || '';
    this.zone_name = localStorage.getItem('zone_name') || '';

    this.loadEditableForm3();
  }






  loadEditableForm3(): void {

    console.log('loadEditableForm3 called');

    this.userService.getEditableForm3().subscribe({

      next: (res: any) => {

        const d = res.data;

        this.isEditMode = true;
        this.form3Id = d.id;
        this.form2_id = d.form2_id;

        this.f3SocietyList = d.societies.map((s: any) => ({
          society_id: s.society_id,
          society_name: s.society_name
        }));

        this.voterCounts = d.societies.map((s: any) =>
          Number(s.ass_memlist || 0)
        );

        this.f5Answers = d.societies.map((s: any) =>
          s.ero_claim === 1 ? 'YES' : 'NO'
        );

        this.removedCounts = d.societies.map((s: any) =>
          Number(s.jcount || 0)
        );

        this.remainingCounts = d.societies.map((s: any) =>
          Number(s.rcount || 0)
        );
      },

      error: () => {

        this.isEditMode = false;

        this.form1_id = Number(localStorage.getItem('form1_id'));

        if (this.form1_id) {
          this.loadF3();
        }
      }
    });
  }

  // ================= LOAD F3 DATA =================
  loadF3() {
    this.userService.getForm3Form2List(this.form1_id).subscribe(res => {

      console.log('API Response:', res);

      if (!res?.success) return;

      const societies: any[] = [];
      const voterCounts: number[] = [];

      // API structure: res.data.data
      const form2List = res.data?.data || [];

      form2List.forEach((f2: any) => {

        // API uses "id", not "form2_id"
        if (!this.form2_id && f2.id) {
          this.form2_id = f2.id;
        }

        (f2.selected_soc || []).forEach((soc: any) => {

          societies.push({
            society_id: soc.society_id,
            society_name: soc.society_name
          });

          // API response currently doesn't contain tot_voters
          voterCounts.push(Number(soc.tot_voters || 0));

        });

      });

      this.f3SocietyList = societies;
      this.voterCounts = voterCounts;

      this.f5Answers = societies.map(() => 'NO');
      this.removedCounts = societies.map(() => 0);
      this.remainingCounts = societies.map(() => 0);

      // console.log('Societies:', this.f3SocietyList);
      // console.log('Voter Counts:', this.voterCounts);
      // console.log('Form2 ID:', this.form2_id);

    });
  }
  // ================= SUBMIT =================
  onSubmit() {

    // const society_entries = this.f3SocietyList.map((soc, i) => ({
    //   society_id: soc.society_id,
    //   society_name: soc.society_name,
    //   ass_memlist: String(this.voterCounts[i]),
    //   ero_claim: this.f5Answers[i],
    //   jcount: String(this.removedCounts[i]),
    //   rcount: String(this.remainingCounts[i]),
    //   total: String(this.voterCounts[i])
    // }));

    const society_entries = this.f3SocietyList.map((soc, i) => ({
      society_id: soc.society_id,
      society_name: soc.society_name,
      ass_memlist: String(this.voterCounts[i]),
      ero_claim: this.f5Answers[i].toLowerCase(), // "yes" or "no"
      jcount: Number(this.removedCounts[i]),
      rcount: Number(this.remainingCounts[i]),
      total: Number(this.voterCounts[i])
    }));
    const payload = {
      form2_id: this.form2_id,
      remarks: `Form3 submission for Form2 ID ${this.form2_id}`,
      society_entries
    };

    /* ===== EDIT MODE ===== */
    if (this.isEditMode) {

      this.userService.editForm3(payload).subscribe((res: any) => {

        if (res.success) {

          localStorage.setItem('form3_completed', 'true');

          alert('✔ Form3 Updated Successfully');
          this.router.navigate(['/layout/totalforms']);
        }
      });

    }

    /* ===== ADD MODE ===== */
    else {

      this.userService.submitForm3(payload).subscribe((res: any) => {

        if (res.success) {

          localStorage.setItem('form3_id', res.data.id);
          localStorage.setItem('form3_completed', 'true');

          alert('✔ Form3 Submitted Successfully');
          this.router.navigate(['/layout/totalforms']);
        }
      });
    }
  }


  onCancel() {
    window.history.back();
  }
}