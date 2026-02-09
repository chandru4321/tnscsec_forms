import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../services/user';

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

  constructor(private userService: UserService,
  ) { }

  ngOnInit(): void {
    this.form1_id = Number(localStorage.getItem('form1_id'));
    this.district_name = localStorage.getItem('district_name') || '';
    this.zone_name = localStorage.getItem('zone_name') || '';

    if (this.form1_id) {
      this.loadF3();
    }
  }

  // ================= LOAD F3 DATA =================
  loadF3() {
    this.userService.getForm3Form2List(this.form1_id).subscribe(res => {
      if (!res?.success) return;

      const societies: any[] = [];

      res.data.form2List.forEach((f2: any) => {

        // ✅ FIX: get form2_id correctly
        if (!this.form2_id && f2.form2_id) {
          this.form2_id = f2.form2_id;
        }

        f2.selected_soc.forEach((soc: any) => {
          societies.push({
            society_id: soc.society_id,
            society_name: soc.society_name
          });
        });
      });

      this.f3SocietyList = societies;

      // initialize arrays
      this.voterCounts = societies.map(() => 0);
      this.f5Answers = societies.map(() => 'NO');
      this.removedCounts = societies.map(() => 0);
      this.remainingCounts = societies.map(() => 0);
    });
  }

  // ================= SUBMIT =================
  onSubmit() {

    if (!this.form2_id) {
      alert('form2_id missing. Please reload page.');
      return;
    }

    const society_entries = this.f3SocietyList.map((soc, i) => ({
      society_id: soc.society_id,
      society_name: soc.society_name,

      ass_memlist: String(this.voterCounts[i]),   // ✅ STRING
      ero_claim: this.f5Answers[i],               // YES / NO (string)
      jcount: String(this.removedCounts[i]),      // ✅ STRING
      rcount: String(this.remainingCounts[i]),    // ✅ STRING
      total: String(this.voterCounts[i])          // ✅ STRING
    }));

    const payload = {
      form2_id: this.form2_id,
      remarks: `Form3 submission for Form2 ID ${this.form2_id}`,
      society_entries
    };

    console.log('FINAL PAYLOAD', payload);

    this.userService.submitForm3(payload).subscribe({
      next: () => alert('Form3 submitted successfully'),




      error: err => {
        console.error(err);
        alert(err?.error?.message || 'Submission failed');
      }
    });

  }


  onCancel() {
    window.history.back();
  }
}
