import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserDonateOrganizationComponent } from './user-donate-organization.component';

describe('UserDonateOrganizationComponent', () => {
  let component: UserDonateOrganizationComponent;
  let fixture: ComponentFixture<UserDonateOrganizationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserDonateOrganizationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserDonateOrganizationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
