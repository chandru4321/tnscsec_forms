import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterModule } from '@angular/router';

@Component({
  selector: 'app-forms',
  standalone: true,
  imports: [CommonModule, RouterModule, RouterLink],
  templateUrl: './totalforms.html',
  styleUrls: ['./totalforms.css']
})
export class totalforms {

  formsList = [
    { title: 'மாவட்ட தேர்தல் அலுவலரால் தேர்தல் அறிவிப்பு வெளியிடப்பட்ட விபரம்', code: 'Form1', routerLink: '/layout/form1to10/form1' },
    { title: 'சங்கம் உறுப்பினர் பட்டியல் வெளியிடுதல் மற்றும் வாக்காளர் பட்டியல் அலுவலருக்கு உறுப்பினர் பட்டியல் அனுப்ப அறிவிக்கப்பட்ட விபரம்', code: 'Form2', routerLink: '/layout/form1to10/form2' },
    { title: 'இந்நி வாக்காளர் பட்டியல் வாக்காளர் பட்டியல் அலுவலரால் வெளியிடப்பட்ட விபரம்', code: 'Form3', link: '#' },
    { title: 'வேட்புமனு தாக்கல் பற்றிய விபரம்', code: 'Form4', link: '#' },
    { title: 'வேட்புமனு தாக்கல் செய்த விவரங்கள் மற்றும் எதிர்ப்பு விபரம்', code: 'Form_5(a)', link: '#' },
    { title: 'வேட்புமனு தாக்கல் பின்னர் பரிசீலனை செய்யப்பட்ட வேட்புமனுவின் விபரங்கள்', code: 'Form_5(b)', link: '#' },
    { title: 'வேட்புமனு திரும்ப பெறுதல் மற்றும் போட்டியிடும் வேட்பாளர்கள் விபரங்கள்', code: 'Form6', link: '#' },
    { title: 'வாக்குப்பதிவு பற்றிய விபரங்கள்', code: 'Form7', link: '#' },
    { title: 'வாக்கு எண்ணிக்கை பற்றிய விபரங்கள்', code: 'Form8', link: '#' },
    { title: 'தலைவர் தேர்தல் தொடர்பான விபரம்', code: 'Form9', link: '#' },
    { title: ' துணை தலைவர் தேர்தல் தொடர்பான விபரம்', code: 'Form10', link: '#' }
  ];

}
