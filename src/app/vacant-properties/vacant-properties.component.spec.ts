import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VacantPropertiesComponent } from './vacant-properties.component';

describe('VacantPropertiesComponent', () => {
  let component: VacantPropertiesComponent;
  let fixture: ComponentFixture<VacantPropertiesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VacantPropertiesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VacantPropertiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
