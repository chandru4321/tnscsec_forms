import { Component } from '@angular/core';
import { Form } from '@angular/forms';

interface FormItem {
  title: string;
  link: string;
}

@Component({
  selector: 'app-form-list',
  standalone: true,
  templateUrl: './forms.html',
  styleUrls: ['./forms.css'],
})
export class forms {
  forms: FormItem[] = [
    { title: 'மாவட்ட தேர்தல் அலுவலர் தேர்தல் அறிவிப்பு வழங்கப்பட்ட விராரம்', link: 'Form1' },
    { title: 'சங்கம் உறுப்பினர் பட்டியல் வெளியீடு மற்றும் வாக்காளர பட்டியல் அலுவலருக்கு உறுப்பினர் பட்டியல் அனுப்பல்/அளிக்காத சங்கங்கள் விராரம்', link: 'Form2' },
    { title: 'இருதி வாக்காளர் பட்டியல் வாக்காளர் பட்டியல் அலுவலரால் வெளியீட்டப்பட்ட விராரம்', link: 'Form3' },
    { title: 'வேட்புமனு தாக்கல் பற்றிய விவரங்கள்', link: 'Form4' },
    { title: 'வேட்புமனு தாக்கல் செய்த உறுப்பினர்களின் பெயர் மற்றும் விவரம்', link: 'Form5(a)' },
    { title: 'வேட்புமனு பரிசீலனை மற்றும் செலுத்தக்கப்பட்ட வேட்புமனுக்கள் பட்டியல் பற்றிய விவரங்கள்', link: 'Form5(b)' },
    { title: 'வேட்புமனு திரும்பப் பெறுதல் மற்றும் போட்டியிலிருந்து வேட்பாளர் இனிப்பு பற்றிய விவரங்கள்', link: 'Form6' },
    { title: 'வாக்குப்பதிவு பற்றிய விவரங்கள்', link: 'Form7' },
    { title: 'வாக் எண்களுக்கையப் பற்றிய விவரங்கள்', link: 'Form8' },
    { title: 'தலைவர் தேர்தல் தொடர்பான விவரம்', link: 'Form9' },
    { title: 'துணை தலைவர் தேர்தல் தொடர்பான விவரம்', link: 'Form10' },
  ];
}
