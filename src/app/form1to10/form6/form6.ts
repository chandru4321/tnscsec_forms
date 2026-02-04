import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../services/user';

@Component({
  selector: 'app-form6',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './form6.html',
  styleUrls: ['./form6.css']
})
export class Form6 implements OnInit {

  district_name = '';
  zone_name = '';

  // 🔥 REQUIRED FOR STOP ELECTION
  form6_id!: number;

  societies: any[] = [];

  showRejectPopup = false;
  showStopPopup = false;

  selectedSociety: any = null;
  stopReason = '';

  constructor(private userService: UserService) { }

  ngOnInit(): void {
    this.district_name = localStorage.getItem('district_name') || '';
    this.zone_name = localStorage.getItem('zone_name') || '';

    // 🔥 INIT FORM 6 ONCE
    this.initForm6();
  }

  /* ================= INIT FORM 6 ================= */
  initForm6() {
    this.userService.initForm6().subscribe(res => {
      if (res?.success) {
        this.form6_id = res.data.form6_id;   // ✅ SAVE IT
        this.loadPreview();
      }
    });
  }

  /* ================= LOAD PREVIEW ================= */
  loadPreview() {
    this.userService.getForm6Preview().subscribe(res => {
      if (!res?.success) return;

      this.societies = res.data.societies.map((s: any) => ({
        ...s,
        sc_st: Number(s.declared?.sc_st) || 0,
        women: Number(s.declared?.women) || 0,
        general: Number(s.declared?.general) || 0,
        total:
          (Number(s.declared?.sc_st) || 0) +
          (Number(s.declared?.women) || 0) +
          (Number(s.declared?.general) || 0),
        rejectDone: false,
        stopDone: false,
        members: (s.members || []).map((m: any) => ({
          ...m,
          checked: false
        }))
      }));
    });
  }

  /* ================= SIMULATE (REJECT) ================= */
  openRejectPopup(s: any) {
    this.selectedSociety = s;
    this.showRejectPopup = true;
  }

  closeReject() {
    this.showRejectPopup = false;
    this.selectedSociety = null;
  }

  getMembers(type: string) {
    return this.selectedSociety?.members.filter(
      (m: any) => m.category_type === type
    ) || [];
  }

  submitRejectedMembers() {

    const withdrawIds = this.selectedSociety.members
      .filter((m: any) => m.checked)
      .map((m: any) => m.id);

    if (!withdrawIds.length) {
      alert('குறைந்தது ஒரு உறுப்பினரை தேர்வு செய்யவும்');
      return;
    }

    // ✅ SIMULATE PAYLOAD (NO form6_id)
    const payload = {
      form4_filed_soc_id: this.selectedSociety.form4_filed_soc_id,
      withdraw_member_ids: withdrawIds
    };

    this.userService.simulateForm6(payload).subscribe(res => {
      if (!res?.success) return;

      this.selectedSociety.sc_st = res.data.remaining_counts.sc_st;
      this.selectedSociety.women = res.data.remaining_counts.women;
      this.selectedSociety.general = res.data.remaining_counts.general;
      this.selectedSociety.total = res.data.remaining_counts.total;

      this.selectedSociety.rejectDone = true;
      this.closeReject();
    });
  }

  /* ================= STOP ELECTION ================= */
  openStopPopup(s: any) {
    this.selectedSociety = s;
    this.stopReason = '';
    this.showStopPopup = true;
  }

  closeStop() {
    this.showStopPopup = false;
    this.selectedSociety = null;
  }

  submitStop() {

    if (!this.stopReason.trim()) {
      alert('நிறுத்தக் காரணத்தை உள்ளிடவும்');
      return;
    }

    // ✅ STOP-ELECTION PAYLOAD (form6_id REQUIRED)
    const payload = {
      form6_id: this.form6_id,   // 🔥 THIS FIXES YOUR ERROR
      form4_filed_soc_id: this.selectedSociety.form4_filed_soc_id,
      action: 'STOP',
      reason: this.stopReason
    };

    this.userService.stopElectionForm6(payload).subscribe(res => {
      if (res?.success) {
        this.selectedSociety.stopDone = true;
        this.closeStop();
      }
    });
  }
}
