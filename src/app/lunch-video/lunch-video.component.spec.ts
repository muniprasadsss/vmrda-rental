import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LunchVideoComponent } from './lunch-video.component';

describe('LunchVideoComponent', () => {
  let component: LunchVideoComponent;
  let fixture: ComponentFixture<LunchVideoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LunchVideoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LunchVideoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
