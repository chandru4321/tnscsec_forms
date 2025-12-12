import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { UserService } from '../../services/user';
import { Router } from '@angular/router';

@Component({
  selector: 'app-form2',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './form2.html',
  styleUrls: ['./form2.css'],
})
export class Form2 implements OnInit {

  district_name = '';
  zone_name = '';
  form1_id = 43; 

  selectedSocieties: any[] = [];
  finalCheckboxList: any[] = [];

  f3List: string = '';

  /* F5 = selected, F6 = unselected */
  f5_selectedList: any[] = [];
  f6_unselectedList: any[] = [];

  constructor(
    private userService: UserService,
    private router: Router
  ) {}

  ngOnInit() {
    this.district_name = localStorage.getItem('district_name') || '';
    this.zone_name = localStorage.getItem('zone_name') || '';

    this.loadForm1Selected();
  }

  /** API → Load F3 list */
  loadForm1Selected() {
    this.userService.getForm1Selected(this.form1_id).subscribe(res => {
      if (res.success) {

        this.selectedSocieties = res.data.selected_soc;

        this.f3List = this.selectedSocieties
          .map(x => x.society_name)
          .join('\n');

        this.buildFinalList();
      }
    });
  }

  /** Build F4 checkboxes (all OFF at first) */
  buildFinalList() {
    this.finalCheckboxList = this.selectedSocieties.map(soc => ({
      society_id: soc.society_id,
      society_name: soc.society_name,
      checked: false
    }));

    this.updateF5F6();
  }

  /** Build F5 and F6 dynamically */
  updateF5F6() {
    this.f5_selectedList = this.finalCheckboxList.filter(x => x.checked);
    this.f6_unselectedList = this.finalCheckboxList.filter(x => !x.checked);
  }

  /** Checkbox clicked */
  toggleCheckbox(item: any) {
    item.checked = !item.checked;
    this.updateF5F6();
  }

  /** ✅ FINAL SUBMIT API CALL */
  submitForm2() {

    const payload = {
      remark: "Form2 submission test",      // later replace with real remark
      selected_soc: this.f5_selectedList,   // F5
      non_selected_soc: this.f6_unselectedList  // F6
    };

    this.userService.submitForm2(this.form1_id, payload)
      .subscribe(res => {
        if (res.success) {
          alert("✔ Form2 Saved Successfully!");

          // OPTIONAL: redirect to Form3 or dashboard
          // this.router.navigate(['/form3']);
        }
      });
  }

}
