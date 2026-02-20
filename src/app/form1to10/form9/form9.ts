import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../services/user';
import { Router } from '@angular/router';

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

  // Tables
  f3List: any[] = [];
  f4List: any[] = [];
  f5List: any[] = [];
  isFormSubmitted = false;

  showF4Table = false;
  showF5Table = false;

  district_name = '';
  zone_name = '';

  showModal = false;
  selectedSociety: any = null;
  candidates: Candidate[] = [];
  withdrawnData: any[] = [];
  // Finalize controls (F5)
  selectedPresidentId: number | null = null;
  electionType: 'UNOPPOSED' | 'POLL' | null = null;



  // Action control
  currentAction: 'REJECT' | 'WITHDRAW' | 'FINALIZE' | null = null;

  form9_id!: number;

  constructor(private userService: UserService, private router: Router) { }

  // ======================
  // PAGE LOAD
  // ======================
  ngOnInit(): void {
    this.district_name = localStorage.getItem('district_name') || '';
    this.zone_name = localStorage.getItem('zone_name') || '';
    this.callInitOnce();
  }

  callInitOnce(): void {
    this.userService.form9init({}).subscribe({
      next: (res: any) => {
        this.form9_id = res?.data?.form9_id;
        this.loadPreview();
      },
      error: () => this.loadPreview()
    });
  }

  // ======================
  // PREVIEW (Main Source)
  // ======================
  loadPreview(): void {
    this.userService.getForm9Preview().subscribe({
      next: (res: any) => {

        if (!res?.success || !res.data?.societies) {
          this.f3List = [];
          this.f4List = [];
          this.f5List = [];
          this.showF4Table = false;
          this.showF5Table = false;
          return;
        }

        const societies = res.data.societies;

        this.district_name = res.data.district_name;
        this.zone_name = res.data.zone_name;

        // ======================
        // F3 → FINAL COUNTS
        // ======================
        this.f3List = societies.map((soc: any) => ({
          form9_society_id: soc.form9_society_id,
          society_name: soc.society_name,

          sc_st: soc.final_counts?.sc_st ?? 0,
          women: soc.final_counts?.women ?? 0,
          general: soc.final_counts?.general ?? 0,
          total: soc.final_counts?.total ?? 0,

          candidates: soc.candidates || []
        }));

        // ======================
        // F4 → REJECTED
        // ======================
        this.f4List = societies
          .filter((soc: any) => (soc.rejected_counts?.total ?? 0) > 0)
          .map((soc: any) => ({
            form9_society_id: soc.form9_society_id,
            society_name: soc.society_name,

            sc_st: soc.rejected_counts.sc_st,
            women: soc.rejected_counts.women,
            general: soc.rejected_counts.general,
            total: soc.rejected_counts.total,

            candidates: soc.candidates || []
          }));

        this.showF4Table = this.f4List.length > 0;

        // ======================
        // F5 → WITHDRAWN
        // ======================
        // ======================
        // F5 → WITHDRAWN (from backend only)
        // ======================
        this.f5List = societies
          .filter((soc: any) =>
            (soc.withdrawn_counts?.total ?? 0) > 0 || soc.is_finalized
          )
          .map((soc: any) => {

            const withdrawnCandidates =
              (soc.candidates || []).slice(0, soc.withdrawn_counts?.total || 0);

            return {
              form9_society_id: soc.form9_society_id,
              society_name: soc.society_name,

              sc_st: soc.withdrawn_counts?.sc_st ?? 0,
              women: soc.withdrawn_counts?.women ?? 0,
              general: soc.withdrawn_counts?.general ?? 0,
              total: soc.withdrawn_counts?.total ?? 0,

              candidates: withdrawnCandidates,

              // IMPORTANT
              submitted: soc.is_finalized
            };
          });

        this.showF5Table = this.f5List.length > 0;


      }
    });
  }

  selectPresident(candidate: Candidate) {
    this.candidates.forEach(c => c.is_elected = false);
    candidate.is_elected = true;
    this.selectedPresidentId = candidate.form5_member_id;
  }


  // ======================
  // OPEN MODAL
  // ======================
  addSociety(row: any, action: 'REJECT' | 'WITHDRAW' | 'FINALIZE'): void {
    this.selectedSociety = row;
    this.currentAction = action;

    // reset finalize values
    this.selectedPresidentId = null;
    this.electionType = null;

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
    this.currentAction = null;
  }

  // ======================
  // CATEGORY FILTERS
  // ======================
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

  // ======================
  // SUBMIT (REJECT / WITHDRAW)
  // ======================

  submitModal(): void {

    if (!this.selectedSociety) return;

    // ==========================
    // F5 → FINALIZE
    // ==========================
    if (this.currentAction === 'FINALIZE') {

      if (!this.selectedPresidentId) {
        alert('ஒரு உறுப்பினரை தேர்வு செய்யவும்');
        return;
      }

      if (!this.electionType) {
        alert('Election type தேர்வு செய்யவும்');
        return;
      }

      const payload = {
        form9_society_id: this.selectedSociety.form9_society_id,
        election_type: this.electionType, // UNOPPOSED or POLL
        president_form5_candidate_id: this.selectedPresidentId
      };

      this.userService.form9societyfinalize(payload).subscribe({
        next: (res: any) => {
          if (res?.success) {
            alert('Society Finalized');
            this.closeModal();
            this.loadPreview(); // reload → button becomes submitted
          }
        },
        error: err => alert(err?.error?.message || 'Finalize failed')
      });

      return;
    }



    // ==========================
    // F3 / F4 logic (OLD – unchanged)
    // ==========================
    const selected = this.candidates
      .filter(c => c.is_elected)
      .map(c => ({
        form5_member_id: c.form5_member_id
      }));

    const payload = {
      form9_society_id: this.selectedSociety.form9_society_id,
      candidates: selected
    };

    const apiCall = this.currentAction === 'REJECT'
      ? this.userService.form9reject(payload)
      : this.userService.form9withdraw(payload);

    apiCall.subscribe({
      next: (res: any) => {
        if (res?.success) {
          alert(this.currentAction === 'REJECT'
            ? 'Rejected successfully'
            : 'Withdrawn successfully');

          this.closeModal();
          this.loadPreview();
        }
      },
      error: err => alert(err?.error?.message || 'API error')
    });
  }
  submitForm9(): void {

    if (this.isFormSubmitted) return;

    const payload = {
      form9_id: this.form9_id
    };

    this.userService.form9submit(payload).subscribe({
      next: (res: any) => {
        if (res?.success) {
          alert('Form9 Submitted Successfully');
          this.isFormSubmitted = true;
          this.router.navigate(['/layout/totalforms']);

        }
      },
      error: err => alert(err?.error?.message || 'Submit failed')
    });
  }
  goBack(): void {
    window.history.back();
  }


}
