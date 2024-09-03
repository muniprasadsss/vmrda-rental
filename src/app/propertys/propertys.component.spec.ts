import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PropertysComponent } from './propertys.component';

describe('PropertysComponent', () => {
  let component: PropertysComponent;
  let fixture: ComponentFixture<PropertysComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PropertysComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PropertysComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
