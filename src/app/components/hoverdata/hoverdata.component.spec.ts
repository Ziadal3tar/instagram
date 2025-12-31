import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HoverdataComponent } from './hoverdata.component';

describe('HoverdataComponent', () => {
  let component: HoverdataComponent;
  let fixture: ComponentFixture<HoverdataComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [HoverdataComponent]
    });
    fixture = TestBed.createComponent(HoverdataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
