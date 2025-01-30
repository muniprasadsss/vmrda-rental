import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RazorpayComponent } from './razorpay.component';

describe('RazorpayComponent', () => {
  let component: RazorpayComponent;
  let fixture: ComponentFixture<RazorpayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RazorpayComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RazorpayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
