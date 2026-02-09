import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Form9 } from './form9';

describe('Form9', () => {
  let component: Form9;
  let fixture: ComponentFixture<Form9>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Form9]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Form9);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
