import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CouponBuyPageComponent } from './coupon-buy-page.component';
describe('CouponBuyPageComponent', () => {
  let component: CouponBuyPageComponent;
  let fixture: ComponentFixture<CouponBuyPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CouponBuyPageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CouponBuyPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
