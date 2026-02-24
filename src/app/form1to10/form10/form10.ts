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
  selector: 'app-form10',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './form10.html',
  styleUrls: ['./form10.css']
})
export class Form10 implements OnInit {

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

  // FINALIZE controls
  selectedVicePresidentId: number | null = null;
  electionType: 'UNOPPOSED' | 'POLL' | null = null;

  // Action control
  currentAction: 'REJECT' | 'WITHDRAW' | 'FINALIZE' | null = null;

  form10_id!: number;

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
    this.userService.form10init({}).subscribe({
      next: (res: any) => {
        this.form10_id = res?.data?.form10_id;
        this.loadPreview();
      },
      error: () => this.loadPreview()
    });
  }

  // ======================
  // PREVIEW
  // ======================
  loadPreview(): void {
    this.userService.getForm10Preview().subscribe({
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

        // F3 – Final Counts
        this.f3List = societies.map((soc: any) => ({
          form10_society_id: soc.form10_society_id,
          society_name: soc.society_name,

          sc_st: soc.final_counts?.sc_st ?? 0,
          women: soc.final_counts?.women ?? 0,
          general: soc.final_counts?.general ?? 0,
          total: soc.final_counts?.total ?? 0,

          candidates: soc.candidates || []
        }));

        // F4 – Rejected
        this.f4List = societies
          .filter((soc: any) => (soc.rejected_counts?.total ?? 0) > 0)
          .map((soc: any) => ({
            form10_society_id: soc.form10_society_id,
            society_name: soc.society_name,

            sc_st: soc.rejected_counts.sc_st,
            women: soc.rejected_counts.women,
            general: soc.rejected_counts.general,
            total: soc.rejected_counts.total,

            candidates: soc.candidates || []
          }));

        this.showF4Table = this.f4List.length > 0;

        // F5 – Withdrawn / Finalized
        this.f5List = societies
          .filter((soc: any) =>
            (soc.withdrawn_counts?.total ?? 0) > 0 || soc.is_finalized
          )
          .map((soc: any) => ({
            form10_society_id: soc.form10_society_id,
            society_name: soc.society_name,

            sc_st: soc.withdrawn_counts?.sc_st ?? 0,
            women: soc.withdrawn_counts?.women ?? 0,
            general: soc.withdrawn_counts?.general ?? 0,
            total: soc.withdrawn_counts?.total ?? 0,

            candidates: soc.candidates || [],
            submitted: soc.is_finalized
          }));

        this.showF5Table = this.f5List.length > 0;
      }
    });
  }

  // ======================
  // MODAL OPEN
  // ======================
  addSociety(row: any, action: 'REJECT' | 'WITHDRAW' | 'FINALIZE'): void {

    this.selectedSociety = row;
    this.currentAction = action;

    // Reset selections
    this.selectedVicePresidentId = null;
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
  // SELECT PRESIDENT


  // ======================
  // SELECT VICE PRESIDENT
  // ======================
  selectVicePresident(candidate: Candidate) {
    this.selectedVicePresidentId = candidate.form5_member_id;
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
  // SUBMIT MODAL
  // ======================
  submitModal(): void {

    if (!this.selectedSociety) return;

    // ===== FINALIZE =====
    if (this.currentAction === 'FINALIZE') {

      if (!this.selectedVicePresidentId) {
        alert('Vice President தேர்வு செய்யவும்');
        return;
      }

      if (!this.electionType) {
        alert('Election type தேர்வு செய்யவும்');
        return;
      }

      const payload = {
        form10_society_id: this.selectedSociety.form10_society_id,
        election_type: this.electionType,

        // Auto assign same ID
        vice_president_form5_candidate_id: this.selectedVicePresidentId
      };

      this.userService.form10societyfinalize(payload).subscribe({
        next: (res: any) => {
          if (res?.success) {
            alert('Society Finalized');
            this.closeModal();
            this.loadPreview();
          }
        },
        error: err => alert(err?.error?.message || 'Finalize failed')
      });

      return;
    }
    // ===== REJECT / WITHDRAW =====
    const selected = this.candidates
      .filter(c => c.is_elected)
      .map(c => ({
        form5_member_id: c.form5_member_id
      }));

    const payload = {
      form10_society_id: this.selectedSociety.form10_society_id,
      candidates: selected
    };

    const apiCall = this.currentAction === 'REJECT'
      ? this.userService.form10reject(payload)
      : this.userService.form10withdraw(payload);

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

  // ======================
  // FINAL FORM SUBMIT
  // ======================
  submitForm10(): void {

    if (this.isFormSubmitted) return;

    const payload = {
      form10_id: this.form10_id
    };

    this.userService.form10submit(payload).subscribe({
      next: (res: any) => {
        if (res?.success) {
          alert('Form10 Submitted Successfully');
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