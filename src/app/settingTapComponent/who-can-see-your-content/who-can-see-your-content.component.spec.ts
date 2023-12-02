import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WhoCanSeeYourContentComponent } from './who-can-see-your-content.component';

describe('WhoCanSeeYourContentComponent', () => {
  let component: WhoCanSeeYourContentComponent;
  let fixture: ComponentFixture<WhoCanSeeYourContentComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [WhoCanSeeYourContentComponent]
    });
    fixture = TestBed.createComponent(WhoCanSeeYourContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
