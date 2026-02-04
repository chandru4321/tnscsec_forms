import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../services/user';

@Component({
  selector: 'app-form4',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './form4.html',
  styleUrls: ['./form4.css']
})
export class Form4 implements OnInit {

  department_id = 2;
  district_id = 1;
  zone_id = 1;

  district_name = '';
  zone_name = '';
  form4_id!: number;

  societyList: any[] = [];
  selectedSocietyList: any[] = [];
  unselectedSocietyList: any[] = [];

  constructor(private userService: UserService) { }

  ngOnInit(): void {
    this.district_name = localStorage.getItem('district_name') || '';
    this.zone_name = localStorage.getItem('zone_name') || '';
    this.form4_id = Number(localStorage.getItem('form4_id'));

    this.loadF3();
  }

  /* ================= LOAD F3 ================= */
  loadF3() {
    this.userService.getForm4().subscribe(res => {
      if (!res?.success) return;

      const map = new Map<number, any>();

      res.data.selectedSocList.forEach((s: any) => {
        if (!map.has(s.society_id)) {

          const sc = Number(s.sc_st) || 0;
          const women = Number(s.women) || 0;
          const general = Number(s.general) || 0;

          map.set(s.society_id, {
            society_id: s.society_id,
            society_name: s.society_name,
            rural_id: s.rural_id,

            sc_st: sc,
            women: women,
            general: general,
            total: sc + women + general,

            selected: false,

            declared_sc_st: 0,
            declared_women: 0,
            declared_general: 0,

            remarks: null   // ✅ ONLY remarks
          });
        }
      });

      this.societyList = Array.from(map.values());

      if (this.form4_id) {
        this.loadCheckboxStatus();
      }
    });
  }

  /* ============== FETCH CHECKBOX PREVIEW ============== */
  loadCheckboxStatus() {
    this.userService.getForm4Checkbox(this.form4_id).subscribe(res => {
      if (!res?.success) return;

      const filed = res.data?.filed || [];
      const selectedSet = new Set<number>();

      filed.forEach((s: any) => {
        if (s.selected === true) {
          selectedSet.add(s.society_id);
        }
      });



      this.societyList.forEach(s => {
        s.selected = selectedSet.has(s.society_id);
      });

      this.updateLists();
    });
  }

  /* ============== CHECKBOX CHANGE ============== */
  onSelectChange() {
    this.updateLists();
    this.saveCheckboxPreview();
  }

  /* ============== SAVE CHECKBOX PREVIEW ============== */
  saveCheckboxPreview() {

    const selectedIds = this.societyList
      .filter(s => s.selected)
      .map(s => s.society_id);

    if (selectedIds.length === 0) return;

    this.userService.saveForm4Checkbox({ selected_ids: selectedIds }).subscribe({
      next: () => console.log('Checkbox preview saved'),
      error: err => console.error('Checkbox preview error', err)
    });
  }

  /* ============== BUILD F4 / F5 ============== */
  updateLists() {

    this.selectedSocietyList = this.societyList
      .filter(s => s.selected)
      .map(s => ({
        society_id: s.society_id,
        society_name: s.society_name,
        rural_id: s.rural_id,
        selected: true,

        declared_sc_st: s.declared_sc_st,
        declared_women: s.declared_women,
        declared_general: s.declared_general,

        remarks: s.remarks
      }));

    this.unselectedSocietyList = this.societyList.filter(s => !s.selected);
  }

  /* ============== FINAL SUBMIT ============== */
  submit() {

    if (!this.selectedSocietyList.length) {
      alert('Please select at least one society');
      return;
    }

    const payload = {
      department_id: this.department_id,
      district_id: this.district_id,
      district_name: this.district_name,
      zone_id: this.zone_id,
      zone_name: this.zone_name,

      form2_selected_list: this.selectedSocietyList
    };

    this.userService.submitForm4(payload).subscribe({
      next: res => {
        if (res?.success) {
          alert('Form 4 submitted successfully');
          localStorage.setItem('form4_id', res.data.form4_id);
        }
      },
      error: err => console.error('Submit error', err)
    });
  }

  cancel() {
    window.history.back();
  }
}
