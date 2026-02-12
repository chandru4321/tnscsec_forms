import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../services/user';

@Component({
    selector: 'app-form8',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './form8.html',
    styleUrls: ['./form8.css']
})
export class Form8 implements OnInit {

    district_name = '';
    Zone_name = '';

    countingSocieties: any[] = [];
    stoppedSocieties: any[] = [];

    selectedSociety: any = null;
    showPreviewPopup: boolean = false;

    constructor(private userService: UserService) { }

    ngOnInit(): void {
        this.district_name = localStorage.getItem('district_name') || '';
        this.Zone_name = localStorage.getItem('zone_name') || '';
        this.loadPreview();
    }

    /* ================= LOAD PREVIEW ================= */
    loadPreview() {
        this.userService.getForm8Preview().subscribe((res: any) => {

            if (!res?.success) return;

            const data = res.data;

            /* ===== F3 – Stopped societies ===== */
            const stopped = data.stopped_elections || {};
            const rule52_18 = stopped.RULE_52_18 || [];
            const rule52A_6 = stopped.RULE_52A_6 || [];

            this.stoppedSocieties = [...rule52_18, ...rule52A_6];

            /* ===== F4 – NO ISSUES societies ===== */
            const polled = data.polled_societies || [];

            this.countingSocieties = polled
                .filter((s: any) => s.polling_suspension_count === 'NO_ISSUES')
                .map((s: any) => ({
                    ...s,

                    rural: {
                        sc_st: s.rural?.sc_st || 0,
                        women: s.rural?.women || 0,
                        general: s.rural?.general || 0
                    },

                    ballot_box_votes: 0,
                    valid_votes: 0,
                    invalid_votes: 0,
                    remarks: '',

                    selectedMembers: [],
                    submitted: false
                }));
        });
    }

    /* ================= POPUP ================= */
    openPreviewPopup(row: any) {
        this.selectedSociety = row;

        if (!this.selectedSociety.selectedMembers) {
            this.selectedSociety.selectedMembers = [];
        }

        this.showPreviewPopup = true;
    }

    closePreview() {
        this.showPreviewPopup = false;
        this.selectedSociety = null;
    }

    getMembers(category: string) {
        if (!this.selectedSociety || !this.selectedSociety.members) return [];
        return this.selectedSociety.members[category] || [];
    }

    /* ================= MEMBER SELECT ================= */
    onMemberToggle(member: any, category: string, event: any) {

        if (!this.selectedSociety.selectedMembers) {
            this.selectedSociety.selectedMembers = [];
        }

        if (event.target.checked) {
            this.selectedSociety.selectedMembers.push({
                form5_member_id: member.form5_member_id,
                category_type: category
            });
        } else {
            this.selectedSociety.selectedMembers =
                this.selectedSociety.selectedMembers.filter(
                    (m: any) => m.form5_member_id !== member.form5_member_id
                );
        }
    }

    /* ================= SAVE WINNERS (Popup Submit) ================= */
    submitPreview() {

        const selected = this.selectedSociety.selectedMembers;

        if (!selected || selected.length === 0) {
            alert('உறுப்பினரை தேர்வு செய்யவும்');
            return;
        }

        // Count category
        const count = { SC_ST: 0, WOMEN: 0, GENERAL: 0 };

        selected.forEach((m: any) => {
            if (m.category_type === 'SC_ST') count.SC_ST++;
            if (m.category_type === 'WOMEN') count.WOMEN++;
            if (m.category_type === 'GENERAL') count.GENERAL++;
        });

        const limit = this.selectedSociety.rural;

        // Validation
        if (
            count.SC_ST !== limit.sc_st ||
            count.WOMEN !== limit.women ||
            count.GENERAL !== limit.general
        ) {
            alert(
                `தேர்வு எண்ணிக்கை தவறு!\n` +
                `SC/ST: ${limit.sc_st}\n` +
                `மகளிர்: ${limit.women}\n` +
                `பொது: ${limit.general}`
            );
            return;
        }

        // Mark as saved locally
        this.selectedSociety.submitted = true;
        this.closePreview();
        alert('வெற்றிகரமாக சேமிக்கப்பட்டது');
    }

    /* ================= FINAL SUBMIT (Form8) ================= */
    onSubmitForm8() {

        // Validate all rows winners selected
        const notSelected = this.countingSocieties.filter(s => !s.submitted);

        if (notSelected.length > 0) {
            alert('அனைத்து சங்கங்களுக்கும் உறுப்பினர்களை தேர்வு செய்யவும்');
            return;
        }

        const payload = {
            societies: this.countingSocieties.map(s => {

                // Convert winners by category
                const winnersByCategory: any = {
                    SC_ST: [],
                    WOMEN: [],
                    GENERAL: []
                };

                s.selectedMembers.forEach((m: any) => {
                    winnersByCategory[m.category_type].push({
                        form5_member_id: m.form5_member_id
                    });
                });

                return {
                    form7_society_id: s.form7_society_id,

                    polling_details: {
                        ballot_votes_at_counting: s.ballot_box_votes,
                        valid_votes: s.valid_votes,
                        invalid_votes: s.invalid_votes,
                        remarks: s.remarks
                    },

                    winners: winnersByCategory
                };
            })
        };

        console.log('Form8 Payload:', payload);

        this.userService.submitForm8(payload).subscribe({
            next: (res: any) => {
                if (res?.success) {
                    alert('Form 8 வெற்றிகரமாக சமர்ப்பிக்கப்பட்டது');
                }
            },
            error: () => {
                alert('Form 8 சமர்ப்பிப்பதில் பிழை ஏற்பட்டது');
            }
        });
    }

    /* ================= CANCEL ================= */
    onCancel() {
        if (confirm('உறுதியாக ரத்து செய்யவா?')) {
            this.loadPreview();
        }
    }
}
