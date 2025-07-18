import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IssueNoticeComponent } from './issue-notice.component';

describe('IssueNoticeComponent', () => {
  let component: IssueNoticeComponent;
  let fixture: ComponentFixture<IssueNoticeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IssueNoticeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IssueNoticeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
