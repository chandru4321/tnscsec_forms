import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../services/user';
import { FilterByCategoryPipe } from '../../pipes/filter-by-category-pipe';

@Component({
  selector: 'app-form6',
  standalone: true,
  imports: [CommonModule, FormsModule, FilterByCategoryPipe],
  templateUrl: './form6.html',
  styleUrls: ['./form6.css']
})
export class Form6 implements OnInit {

  district_name = '';
  zone_name = '';
  form6_id!: number;

  // 🔥 NEW SEPARATION
  f3Societies: any[] = [];   // STATIC
  f4Societies: any[] = [];   // WORKING LIST

  showRejectPopup = false;
  showStopPopup = false;
  showFinalSubmitPopup = false;
  form6Submitted = false;

  selectedSociety: any = null;
  stopRemark = '';

  f5List: any[] = [];
  f6List: any[] = [];
  f7List: any[] = [];

  showViewPopup = false;
  viewSociety: any = null;

  constructor(private userService: UserService) { }

  ngOnInit(): void {
    this.district_name = localStorage.getItem('district_name') || '';
    this.zone_name = localStorage.getItem('zone_name') || '';
    this.initForm6();
  }

  /* ================= INIT ================= */
  initForm6() {
    this.userService.initForm6().subscribe(res => {
      if (res?.success) {
        this.form6_id = res.data.form6_id;
        this.loadPreview();
      }
    });
  }

  /* ================= PREVIEW ================= */
  loadPreview() {
    this.userService.getForm6Preview().subscribe(res => {
      if (!res?.success) return;

      const prepared = res.data.societies.map((s: any) => ({
        ...s,
        sc_st: +s.declared.sc_st,
        women: +s.declared.women,
        general: +s.declared.general,
        total: +s.declared.sc_st + +s.declared.women + +s.declared.general,
        rejectDone: false,
        stopDone: false,
        members: s.members.map((m: any) => ({
          ...m,
          checked: false,
          withdrawn: false
        }))
      }));

      this.f3Societies = JSON.parse(JSON.stringify(prepared)); // snapshot
      this.f4Societies = prepared; // working list
    });
  }

  /* ================= REJECT ================= */
  openRejectPopup(soc: any) {
    this.selectedSociety = soc;
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

  /* ================= SIMULATE ================= */
  onCheckboxChange() {
    const ids = this.selectedSociety.members
      .filter((m: any) => m.checked)
      .map((m: any) => m.id);

    if (!ids.length) return;

    this.userService.simulateForm6({
      form4_filed_soc_id: this.selectedSociety.form4_filed_soc_id,
      withdraw_member_ids: ids
    }).subscribe(res => {
      if (!res?.success) return;

      this.selectedSociety.election_status = res.data.election_status;

      res.data.members.forEach((apiM: any) => {
        const local = this.selectedSociety.members.find(
          (m: any) => m.id === apiM.id
        );
        if (local) local.withdrawn = apiM.withdrawn;
      });
    });
  }

  /* ================= FINAL WITHDRAW ================= */
  finalWithdraw() {

    let membersToWithdraw: any[] = [];

    if (this.selectedSociety.election_status === 'UNOPPOSED') {
      membersToWithdraw = [this.selectedSociety.members[0]];
    } else {
      membersToWithdraw = this.selectedSociety.members.filter(
        (m: any) => m.checked || m.withdrawn
      );
    }

    if (!membersToWithdraw.length) {
      alert('தயவுசெய்து உறுப்பினரை தேர்வு செய்யவும்');
      return;
    }

    let completed = 0;

    membersToWithdraw.forEach((m: any) => {
      this.userService.withdrawForm6({
        form6_id: this.form6_id,
        form5_member_id: m.form5_member_id ?? m.id,
        action: 'WITHDRAW'
      }).subscribe(() => {
        completed++;
        if (completed === membersToWithdraw.length) {
          this.moveSocietyAfterSubmit(this.selectedSociety);
          this.closeReject();
        }
      });
    });
  }

  /* ================= MOVE SOCIETY ================= */
  private moveSocietyAfterSubmit(soc: any) {

    soc.candidates = soc.members
      .filter((m: any) => !m.withdrawn)
      .map((m: any) => ({
        member_name: m.member_name,
        category_type: m.category_type
      }));

    this.f4Societies = this.f4Societies.filter(
      s => s.form4_filed_soc_id !== soc.form4_filed_soc_id
    );

    if (soc.election_status === 'UNOPPOSED') this.f5List.push(soc);
    else if (soc.election_status === 'UNQUALIFIED') this.f6List.push(soc);
    else if (soc.election_status === 'QUALIFIED') this.f7List.push(soc);
  }

  /* ================= VIEW ================= */
  openViewPopup(soc: any) {
    this.viewSociety = { ...soc, candidates: soc.candidates || [] };
    this.showViewPopup = true;
  }

  closeViewPopup() {
    this.viewSociety = null;
    this.showViewPopup = false;
  }

  /* ================= STOP ================= */
  openStopPopup(soc: any) {
    this.selectedSociety = soc;
    this.stopRemark = '';
    this.showStopPopup = true;
  }

  closeStop() {
    this.showStopPopup = false;
    this.selectedSociety = null;
  }

  submitStop() {
    this.userService.stopElectionForm6({
      form6_id: this.form6_id,
      form4_filed_soc_id: this.selectedSociety.form4_filed_soc_id,
      action: 'STOP',
      remark: this.stopRemark
    }).subscribe(res => {
      if (res?.success) {
        this.selectedSociety.stopDone = true;
        this.closeStop();
      }
    });
  }

  /* ================= FINAL FORM 6 SUBMIT ================= */
  submitForm6Final() {
    if (this.form6Submitted) return;

    this.userService.submitForm6({
      form6_id: this.form6_id
    }).subscribe(res => {
      if (res?.success) {
        this.form6Submitted = true;
        this.showFinalSubmitPopup = true;
      }
    });
  }
}
