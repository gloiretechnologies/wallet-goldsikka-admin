import {Injectable} from '@angular/core';
import {ApiService} from '../api.service';
import {PaymentService} from '../_services/payment.service';
import {HttpErrorResponse} from '@angular/common/http';
import {environment} from '../../environments/environment';
@Injectable({
  providedIn: 'root'
})
export class GoldService {
  private is_lock: string;

  constructor(
    private api: ApiService,
    private paymentService: PaymentService
  ) {
  }

  /**
   *
   */
  getCurrentGoldPrice() {
    return this.api.get(`gold/current/price`);
  }

  /**
   * @param quantityInGrams
   * @param amountIncludingCharges
   */
  purchase(quantityInGrams: number, amountIncludingCharges: number, amountExcludingCharges: number, coupon: any, enteredWalletAmount: number, referralCode: any): void {

    this.paymentService.charge(amountIncludingCharges, {
      amountExcludingCharges,
      coupon,
      enteredWalletAmount,
      referralCode
    });
  }


  /**
   * @param quantityInGrams
   * @param fractionamount
   */
  withredeem(quantityInGrams: number, fractionamount: number,amountPayable:number): void {
  //console.log("fractionamount",fractionamount);
    this.paymentService.chargeredeem(quantityInGrams,fractionamount,amountPayable)
     
  }


  /**
   * @param amount
   * @param currentGoldPricePerGram
   */
  amountToQuantity(amount: number, currentGoldPricePerGram: number): number {
    let quantityInGrams: number;
    quantityInGrams = amount / currentGoldPricePerGram;

    return quantityInGrams;
  }

  /**
   * @param quantityInGrams
   * @param pricePerGram
   */
  calculatePrice(quantityInGrams: number, pricePerGram: number): number {
//const fractionalRate: number = this.getFractionalRate(quantityInGrams, redeemPricePerGram);
    return quantityInGrams * (pricePerGram);
  }


  /**
   * @param quantityInGrams
   * @param sellPricePerGram
   */
  calculateSellPrice(quantityInGrams: number, sellPricePerGram: number): number {
    const fractionalRate: number = this.getFractionalRate(quantityInGrams, sellPricePerGram);
    return quantityInGrams * (sellPricePerGram );///////this is  getFractionalRate subtraction formula in  % calculation formula/////// 
  }

  /**
   *
   * @param quantityInGrams
   * @param pricePerGram
   */
  getFractionalRate(quantityInGrams: number, pricePerGram: number): number {///////this is  getFractionalRate sell gold % calculation formula /////
    let fractionalRate: number;

      fractionalRate = (pricePerGram / 100) * 5.7;
    //  if (quantityInGrams == 0.5) {
    //   fractionalRate = (pricePerGram / 100) * 25;
    //  } else if (quantityInGrams == 1 ) {
    //    fractionalRate = (pricePerGram / 100) * 20;
    //  } else if (quantityInGrams == 1.5) {
    //    fractionalRate = (pricePerGram / 100) * 18;
    //  }// else if (quantityInGrams >= 3 && quantityInGrams < 4) {
    // //   fractionalRate = (pricePerGram / 100) * 16;
    // // } else if (quantityInGrams >= 4 && quantityInGrams < 5) {
    // //   fractionalRate = (pricePerGram / 100) * 14;
    // //  }


  //   if (quantityInGrams < 1) {
  //     fractionalRate = (pricePerGram / 100) * 25;
  //   } else if (quantityInGrams >= 1 && quantityInGrams < 2) {
  //     fractionalRate = (pricePerGram / 100) * 20;
  //   } else if (quantityInGrams >= 2 && quantityInGrams < 3) {
  //     fractionalRate = (pricePerGram / 100) * 18;
  //   } else if (quantityInGrams >= 3 && quantityInGrams < 4) {
  //     fractionalRate = (pricePerGram / 100) * 16;
  //   } else if (quantityInGrams >= 4 && quantityInGrams < 5) {
  //     fractionalRate = (pricePerGram / 100) * 14;
  //  }
     
     // else if (quantityInGrams >= 5) {
    //   // Commented as discussed with Madhuri
    //   //   fractionalRate = (pricePerGram / 100) * 12;
    //   // } else if (quantityInGrams >= 6 && quantityInGrams < 7) {
    //   //   fractionalRate = (pricePerGram / 100) * 10;
    //   // } else if (quantityInGrams >= 7 && quantityInGrams < 8) {
    //   //   fractionalRate = (pricePerGram / 100) * 8;
    //   // } else if (quantityInGrams >= 8 && quantityInGrams < 9) {
    //   //   fractionalRate = (pricePerGram / 100) * 6;
    //   // } else if (quantityInGrams >= 9) {
    // //   fractionalRate = 0;
    // }

    return fractionalRate;
  }

  getFractionalRateredeem(quantityInGrams: number, pricePerGram: number): number { ///////this is  getFractionalRate redeem % calculation formula 
    let fractionalRate: number;
    // fractionalRate = (pricePerGram / 100) * 5.7;
   if (quantityInGrams == 0.5) {
       fractionalRate = (pricePerGram / 100) * 25;
     } else if (quantityInGrams == 1 ) {
       fractionalRate = (pricePerGram / 100) * 20;
     } else if (quantityInGrams == 1.5) {
       fractionalRate = (pricePerGram / 100) * 18;
    } else if(quantityInGrams > 1.5 ){
      fractionalRate = 0;
    }
   return fractionalRate;
  }
  
  /**
   *
   *
   */
  getCurrent22CarartGoldPrice() {
    return this.api.get(`gold/current/22caratPrice`);
  }

  /**
   * @param quantityInGrams
   * @param sellPricePerGram
   */
  calculateWithoutFractionalSellPrice(quantityInGrams: number, sellPricePerGram: number): number {
    const fractionalRate: number = this.getFractionalRate(quantityInGrams, sellPricePerGram);
    return quantityInGrams * (sellPricePerGram);
  }

  goldPriceLock(pricePerGram) {
    this.api.get(`user/wallet/gold/price/lock?price=` + pricePerGram)
      .subscribe((res: any) => {
          this.is_lock = res;
        },
        (err: HttpErrorResponse) => {
          this.is_lock = err.error.message;
        });
    return this.is_lock;

  }

  /**
   * @param quantityInGrams
   * @param amountIncludingCharges
   */
  eventPurchase(amount: number, amountIncludingCharges: number, eventId: string,enteredWalletAmount:number): void {
    this.paymentService.eventCharge(amountIncludingCharges, {amount, eventId,enteredWalletAmount});
  }
  /**
   * @param quantityInGrams
   * @param pricePerGram
   */// getcalculatePrice(quantityInGrams: number, pricePerGram: number): number {
  //       let fractionalRate: number = this.getFractionalRateredeem(quantityInGrams, pricePerGram);
  //       let gst = Math.round( (fractionalRate)* environment.gstPercentage)/100;
  //       fractionalRate = fractionalRate+gst;//Math.round( fractionalRate +(fractionalRate /100)* environment.gstPercentage)/100;
  //       return quantityInGrams * (fractionalRate);
  //     }
  getcalculatePrice(quantityInGrams: number, pricePerGram: number): number {
    let fractionalRate: number = this.getFractionalRateredeem(quantityInGrams, pricePerGram);
    fractionalRate += (fractionalRate /100)* environment.gstPercentage;
    return quantityInGrams * (fractionalRate);
  }
  }


