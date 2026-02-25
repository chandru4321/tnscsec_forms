import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterModule } from '@angular/router';

@Component({
  selector: 'app-forms',
  standalone: true,
  imports: [CommonModule, RouterModule, RouterLink],
  templateUrl: './admin-dashboard.html',
  styleUrls: ['./admin-dashboard.css']
})
export class AdminDashboard {

  formsList = [
    {
      title: 'மாவட்ட தேர்தல் அலுவலரால் தேர்தல் அறிவிப்பு வெளியிடப்பட்ட விபரம்',
      code: 'Form1',
      tableLink: '/layout/admintable/table1'

    },
    {
      title: 'சங்கம் உறுப்பினர் பட்டியல் வெளியிடுதல் மற்றும் வாக்காளர் பட்டியல் அலுவலருக்கு உறுப்பினர் பட்டியல் அனுப்ப அறிவிக்கப்பட்ட விபரம்',
      code: 'Form2',
      tableLink: '/layout/admintable/table2'

    },
    {
      title: 'இந்நி வாக்காளர் பட்டியல் வாக்காளர் பட்டியல் அலுவலரால் வெளியிடப்பட்ட விபரம்',
      code: 'Form3',
      tableLink: '/layout/admintable/table3'
    },
    {
      title: 'வேட்புமனு தாக்கல் பற்றிய விபரம்',
      code: 'Form4',

      tableLink: '/layout/admintable/table4'


    },
    {
      title: 'வேட்புமனு தாக்கல் செய்த விவரங்கள் மற்றும் எதிர்ப்பு விபரம்',
      code: 'Form5',

      tableLink: '/layout/admintable/table5'

    },

    {
      title: 'வேட்புமனு திரும்ப பெறுதல் மற்றும் போட்டியிடும் வேட்பாளர்கள் விபரங்கள்', code: 'Form6',

      tableLink: '/layout/admintable/table6'
    },
    {
      title: 'வாக்குப்பதிவு பற்றிய விபரங்கள்', code: 'Form7',
      tableLink: '/layout/admintable/table7'
    },
    {
      title: 'வாக்கு எண்ணிக்கை பற்றிய விபரங்கள்', code: 'Form8',
      tableLink: '/layout/admintable/table8'
    },

    {
      title: 'தலைவர் தேர்தல் தொடர்பான விபரம்', code: 'Form9',
      tableLink: '/layout/admintable/table9'
    },
    {
      title: ' துணை தலைவர் தேர்தல் தொடர்பான விபரம்', code: 'Form10',
      tableLink: '/layout/admintable/table10'


    }
  ];

  // /** ✅ Check Form-1 completion */
  // isForm1Completed(): boolean {
  //   return localStorage.getItem('form1_completed') === 'true';
  // }

  // isForm2Completed(): boolean {
  //   return !!localStorage.getItem('form2Completed');
  // }
}