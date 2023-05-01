import {Injectable} from '@angular/core';
import {ApiService} from "../api.service";
import {PaymentService} from "../_services/payment.service";

@Injectable({
  providedIn: 'root'
})
export class SchemesService {

  constructor(
    private api: ApiService,
    private paymentService: PaymentService
  ) {
  }

  /**
   * @param quantityInGrams
   * @param amountIncludingCharges
   */
  //  console.log("")

  purchase(amount, data, id): void {
    this.paymentService.schemeCharge(amount, {data, id});
  }



  // onSubmit(quantityInGrams: number, amountIncludingCharges: number, amountExcludingCharges: number, coupon: any, enteredWalletAmount: number, referralCode: any): void {
  //   this.paymentService.charge(amountIncludingCharges, {
  //     amountExcludingCharges,
  //     coupon,
  //     enteredWalletAmount,
  //     referralCode
  //   });
  // }
  /**
   * @param quantityInGrams
   * @param amountIncludingCharges
   */
  mmiPaymentPurchase(finalAmount, data): void {
    this.paymentService.schemeChargeMMI(finalAmount, data);
  }

}
