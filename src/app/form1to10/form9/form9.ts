import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../services/user';

type CategoryType = 'sc_st' | 'women' | 'general';

interface Candidate {
  form5_member_id: number;
  member_name: string;
  aadhar_no: string;
  category_type: CategoryType;
  is_elected: boolean;
}

@Component({
  selector: 'app-form9',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './form9.html',
  styleUrls: ['./form9.css']
})
export class Form9 implements OnInit {

  form9List: any[] = [];

  district_name = '';
  zone_name = '';

  showModal = false;
  selectedSociety: any = null;
  candidates: Candidate[] = [];

  // 🔴 GLOBAL form9_id (from INIT)
  form9_id!: number;

  constructor(private userService: UserService) { }

  // =====================================
  // PAGE LOAD
  // INIT → once → then preview
  // =====================================
  ngOnInit(): void {
    this.district_name = localStorage.getItem('district_name') || '';
    this.zone_name = localStorage.getItem('zone_name') || '';

    this.callInitOnce();
  }

  callInitOnce(): void {
    this.userService.form9init({}).subscribe({
      next: (res: any) => {
        // ✅ Save form9_id from init response
        this.form9_id = res?.data?.form9_id;

        console.log('INIT form9_id:', this.form9_id);

        this.loadPreview();
      },
      error: () => {
        // Even if init fails → load preview
        this.loadPreview();
      }
    });
  }

  // =====================================
  // PREVIEW (NO INIT HERE)
  // =====================================
  loadPreview(): void {
    this.userService.getForm9Preview().subscribe({
      next: (res: any) => {

        if (!res?.success || !res.data?.societies) {
          this.form9List = [];
          return;
        }

        this.district_name = res.data.district_name;
        this.zone_name = res.data.zone_name;

        this.form9List = res.data.societies.map((soc: any) => ({
          form9_id: soc.form4_filed_soc_id,   // FIX
          form9_society_id: soc.form4_filed_soc_id,

          society_name: soc.society_name,

          sc_st: soc.final_counts?.sc_st ?? 0,
          women: soc.final_counts?.women ?? 0,
          general: soc.final_counts?.general ?? 0,
          total: soc.final_counts?.total ?? 0,

          candidates: soc.candidates || [],
          submitted: soc.is_finalized || false
        }));


      },
      error: () => {
        this.form9List = [];
      }
    });
  }

  // =====================================
  // OPEN MODAL
  // =====================================
  addSociety(row: any): void {
    this.selectedSociety = row;

    this.candidates = (row.candidates || []).map((c: any) => ({
      form5_member_id: c.form5_member_id,
      member_name: c.member_name,
      aadhar_no: c.aadhar_no,
      category_type: c.category_type,
      is_elected: false
    }));

    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
    this.selectedSociety = null;
    this.candidates = [];
  }

  // =====================================
  // CATEGORY FILTERS
  // =====================================
  get scstCandidates() {
    return this.candidates.filter(c => c.category_type === 'sc_st');
  }

  get womenCandidates() {
    return this.candidates.filter(c => c.category_type === 'women');
  }

  get generalCandidates() {
    return this.candidates.filter(c => c.category_type === 'general');
  }

  maskAadhar(aadhar: string): string {
    return aadhar ? 'xxxx xxxx ' + aadhar.slice(-4) : '';
  }

  // =====================================
  // சமர்ப்பிக்க → form9reject API
  // =====================================


  submitModal(): void {

    if (!this.selectedSociety) return;

    const selected = this.candidates
      .filter(c => c.is_elected)
      .map(c => ({
        form5_member_id: c.form5_member_id,
        remarks: 'Submitted by officer'
      }));

    if (selected.length === 0) {
      alert('உறுப்பினர்களை தேர்வு செய்யவும்');
      return;
    }

    const payload = {
      form9_id: this.selectedSociety.form9_id,
      form9_society_id: this.selectedSociety.form9_society_id,
      candidates: selected
    };

    this.userService.form9reject(payload).subscribe({
      next: (res: any) => {
        if (res?.success) {

          // 🔹 Update table row
          const index = this.form9List.findIndex(
            x => x.form9_id === this.selectedSociety.form9_id
          );

          if (index !== -1) {
            this.form9List[index].submitted = true;
          }

          this.selectedSociety.submitted = true;

          alert('சமர்ப்பிக்கப்பட்டது');
          this.closeModal();

        } else {
          alert(res?.message || 'Submit failed');
        }
      },
      error: err => alert(err?.error?.message || 'API error')
    });
  }
}