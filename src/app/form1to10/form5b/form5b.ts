import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../services/user';
import { Router } from '@angular/router';

@Component({
  selector: 'app-form5b',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './form5b.html',
  styleUrls: ['./form5b.css']
})

export class Form5b implements OnInit {

  district_name = '';
  zone_name = '';

  f3Societies: any[] = [];
  f4Societies: any[] = [];

  selectedSociety: any = null;

  showRejectPopup = false;
  showStopPopup = false;
  showFinalSubmitPopup = false;

  stopRemark = '';
  formSubmitted = false;

  constructor(
    private userService: UserService,
    private router: Router
  ) { }

  ngOnInit(): void {


    this.district_name = localStorage.getItem('district_name') || '';
    this.zone_name = localStorage.getItem('zone_name') || '';

    this.loadPreview();
  }



  /* ================= PREVIEW ================= */

  loadPreview() {

    this.userService.getForm5bpreview().subscribe(res => {

      if (!res?.success) return;

      const prepared = res.data.societies.map((s: any) => ({

        ...s,

        sc_st: +s.declared.sc_st,
        women: +s.declared.women,
        general: +s.declared.general,
        total: +s.declared.total,

        rejectDone: false,
        stopDone: false,

        members: s.members.map((m: any) => ({
          ...m,
          checked: false
        }))

      }));

      this.f3Societies = JSON.parse(JSON.stringify(prepared));
      this.f4Societies = prepared;

    });

  }

  /* ================= REJECT POPUP ================= */

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

  /* ================= FINAL WITHDRAW ================= */

  finalWithdraw() {

    const candidateIds = this.selectedSociety.members
      .filter((m: any) => m.checked)
      .map((m: any) => m.id);

    if (!candidateIds.length) {

      alert('தயவுசெய்து உறுப்பினரை தேர்வு செய்யவும்');
      return;

    }

    const payload = {

      candidate_ids: candidateIds

    };

    this.userService.postcandidatestop(payload).subscribe(res => {

      if (res?.success) {

        this.selectedSociety.rejectDone = true;

        this.closeReject();

      }

    });

  }

  /* ================= STOP ELECTION ================= */

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

    if (!this.stopRemark) {

      alert('தேர்தல் நிறுத்தக் குறிப்பு கொடுக்கவும்');
      return;

    }

    const payload = {

      form4_filed_soc_id: this.selectedSociety.form4_filed_soc_id,
      stop_remark: this.stopRemark

    };

    this.userService.postsocietystop(payload).subscribe(res => {

      if (res?.success) {

        this.selectedSociety.stopDone = true;

        this.closeStop();

      }

    });

  }

  /* ================= FINAL SUBMIT ================= */

  submitForm5bFinal() {

    if (this.formSubmitted) return;

    this.userService.submitForm5b({}).subscribe(res => {

      if (res?.success) {

        this.formSubmitted = true;

        this.showFinalSubmitPopup = true;

        setTimeout(() => {

          this.router.navigate(['/layout/totalforms']);

        }, 1500);

      }

    });

  }

}