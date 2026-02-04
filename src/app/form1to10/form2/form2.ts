import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../services/user';
import { Router } from '@angular/router';

@Component({
  selector: 'app-form2',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './form2.html',
  styleUrls: ['./form2.css']
})
export class Form2 implements OnInit {

  district_name = '';
  zone_name = '';

  form1_id!: number;

  /* F3 */
  f3List = '';

  /* Checkbox master list */
  finalCheckboxList: {
    society_id: number;
    society_name: string;
    checked: boolean;
  }[] = [];

  /* UI preview */
  f5_selectedList: any[] = [];
  f6_unselectedList: any[] = [];

  constructor(
    private userService: UserService,
    private router: Router
  ) { }

  /* ================= INIT ================= */
  ngOnInit(): void {

    const storedForm1Id = localStorage.getItem('form1_id');
    this.form1_id = storedForm1Id ? Number(storedForm1Id) : 0;

    this.district_name = localStorage.getItem('district_name') || '';
    this.zone_name = localStorage.getItem('zone_name') || '';

    if (this.form1_id) {
      this.loadForm1Selected();
    }
  }

  /* ================= API-1 : LOAD F3 ================= */
  loadForm1Selected(): void {
    this.userService.getForm1Selected(this.form1_id).subscribe(res => {

      if (!res?.success) return;

      const list = res.data.selected_soc;

      // F3 textarea
      this.f3List = list.map((x: any) => x.society_name).join('\n');

      // Build checkbox list
      this.finalCheckboxList = list.map((x: any) => ({
        society_id: x.society_id,
        society_name: x.society_name,
        checked: false
      }));

      this.updateF5F6();
    });
  }

  /* ================= UI LOGIC ================= */
  updateF5F6(): void {
    this.f5_selectedList = this.finalCheckboxList.filter(x => x.checked);
    this.f6_unselectedList = this.finalCheckboxList.filter(x => !x.checked);
  }

  /* ================= SUBMIT (🔥 FIXED) ================= */
  submitForm2(): void {

    // 🔥 BACKEND EXPECTS IDs ONLY
    const selectedIds = this.finalCheckboxList
      .filter(x => x.checked)
      .map(x => x.society_id);

    // Validation
    if (selectedIds.length === 0) {
      alert('⚠️ குறைந்தது ஒரு சங்கத்தை தேர்வு செய்ய வேண்டும்');
      return;
    }

    const payload = {
      selectedIds,                    // ✅ THIS IS THE FIX
      remark: 'Form2 submission test'
    };

    console.log('🚀 FINAL PAYLOAD SENT TO BACKEND:', payload);

    this.userService.submitForm2(payload).subscribe(res => {

      if (res?.success) {

        // Save form2 id for future use
        localStorage.setItem('form2_id', res.data.id);

        alert('✔ Form-2 Saved Successfully');
        this.router.navigate(['/layout/totalforms']);
      }
    });
  }
}
