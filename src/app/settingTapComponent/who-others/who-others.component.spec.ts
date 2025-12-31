import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WhoOthersComponent } from './who-others.component';

describe('WhoOthersComponent', () => {
  let component: WhoOthersComponent;
  let fixture: ComponentFixture<WhoOthersComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [WhoOthersComponent]
    });
    fixture = TestBed.createComponent(WhoOthersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
