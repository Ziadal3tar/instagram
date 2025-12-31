import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReelsCommentsComponent } from './reels-comments.component';

describe('ReelsCommentsComponent', () => {
  let component: ReelsCommentsComponent;
  let fixture: ComponentFixture<ReelsCommentsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ReelsCommentsComponent]
    });
    fixture = TestBed.createComponent(ReelsCommentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
