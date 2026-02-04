import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../services/user';

type CategoryType = 'sc_st' | 'women' | 'general';

interface Member {
  form4_filed_soc_id: number;
  category_type: CategoryType;
  member_name: string;
  aadhar_no: string;
}

@Component({
  selector: 'app-form5',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './form5.html',
  styleUrls: ['./form5.css']
})
export class Form5Component implements OnInit {

  form5List: any[] = [];

  district_name = '';
  zone_name = '';

  showModal = false;
  selectedSociety: any = null;

  members: Member[] = [];

  constructor(private userService: UserService) { }

  ngOnInit(): void {
    this.district_name = localStorage.getItem('district_name') || '';
    this.zone_name = localStorage.getItem('zone_name') || '';
    this.loadForm5();
  }

  /* ===============================
     LOAD FORM 5 ELIGIBLE (DEDUPED)
     =============================== */
  loadForm5() {
    this.userService.getForm5Eligible().subscribe(res => {
      if (!res?.success) return;

      const map = new Map<number, any>();

      res.data.forEach((item: any) => {
        // ✅ DEDUPE BY SOCIETY ID (NOT filed_soc_id)
        if (!map.has(item.society_id)) {
          map.set(item.society_id, {
            society_id: item.society_id,
            society_name: item.society_name,

            // ✅ COUNTS FOR TABLE
            sc_st: item.declared?.sc_st ?? 0,
            women: item.declared?.women ?? 0,
            general: item.declared?.general ?? 0,

            // keep one filed_soc_id (latest is fine)
            filed_soc_id: item.filed_soc_id,

            declared: item.declared,
            submitted: false
          });
        }
      });

      this.form5List = Array.from(map.values());
    });
  }

  /* ===============================
     GETTERS FOR HTML
     =============================== */
  get scstMembers() {
    return this.members.filter(m => m.category_type === 'sc_st');
  }

  get womenMembers() {
    return this.members.filter(m => m.category_type === 'women');
  }

  get generalMembers() {
    return this.members.filter(m => m.category_type === 'general');
  }

  /* ===============================
     HTML ALIASES
     =============================== */
  addSociety(row: any) {
    this.openModal(row);
  }

  submitModal() {
    this.submitForm5();
  }

  /* ===============================
     OPEN MODAL
     =============================== */
  openModal(row: any) {
    this.selectedSociety = row;
    this.members = [];

    this.createMembers('sc_st', row.sc_st);
    this.createMembers('women', row.women);
    this.createMembers('general', row.general);

    this.showModal = true;
  }

  private createMembers(type: CategoryType, count: number) {
    for (let i = 0; i < count; i++) {
      this.members.push({
        form4_filed_soc_id: this.selectedSociety.filed_soc_id,
        category_type: type,
        member_name: '',
        aadhar_no: ''
      });
    }
  }

  closeModal() {
    this.showModal = false;
    this.selectedSociety = null;
    this.members = [];
  }

  /* ===============================
     SUBMIT FORM 5
     =============================== */
  submitForm5() {

    if (!this.selectedSociety) return;

    const hasEmpty = this.members.some(
      m => !m.member_name || !m.aadhar_no
    );

    if (hasEmpty) {
      alert('அனைத்து உறுப்பினர் விவரங்களையும் உள்ளிடவும்');
      return;
    }

    const payload = { members: this.members };

    this.userService.submitForm5(payload).subscribe({
      next: () => {
        alert('Form 5 successfully submitted');

        // ✅ mark row as submitted
        this.selectedSociety.submitted = true;

        this.closeModal();
      },
      error: err => {
        alert(err?.error?.message || 'Submit failed');
      }
    });
  }

  cancel() {
    window.history.back();
  }

  exportExcel() {
    alert('Excel export logic here');
  }
}
