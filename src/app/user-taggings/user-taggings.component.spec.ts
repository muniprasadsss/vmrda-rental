import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserTaggingsComponent } from './user-taggings.component';

describe('UserTaggingsComponent', () => {
  let component: UserTaggingsComponent;
  let fixture: ComponentFixture<UserTaggingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserTaggingsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserTaggingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
