import {Component, OnInit} from '@angular/core';
import {GoldService} from '../gold.service';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {environment} from '../../../environments/environment';
import {HttpErrorResponse} from '@angular/common/http';
import {ApiService} from '../../api.service';
import {isObjectEmpty} from 'ngx-bootstrap/chronos/utils/type-checks';
import { AuthenticationService } from 'src/app/_services/authentication/authentication.service';

@Component({
  selector: 'app-buy-gold',
  templateUrl: './buy-gold.component.html',
  styleUrls: ['./buy-gold.component.scss']
})
export class BuyGoldComponent implements OnInit {

  successMessage: string;
  submitted: boolean;
  isSubmitting: boolean;
  errorMessage: string;
  errors: object = {};
  currentGoldPricePerGram: number;
  gstPercentage: number = environment.gstPercentage;
  amountPayableIncludingCharges: number;
  amountWithGstAmount: number;
  isPriceLock: string;
  description: string;
  walletAmount: any;
  walletAmountInput: boolean = false;

  form: FormGroup = new FormGroup({
    quantity: new FormControl('', [Validators.required, Validators.max(30)]),
    amount: new FormControl('', [Validators.required, Validators.min(100), Validators.maxLength(10)]),
    enteredWalletAmount: new FormControl('', [Validators.pattern('^[0-9]\.*$')]),
    referralCode: new FormControl('', [Validators.min(1)])
  });

  isGreaterThanCouponAmount: boolean = false;

  constructor(
    private api: ApiService,
    private goldService: GoldService,
    private authService: AuthenticationService,


  ) {
  }

  ngOnInit(): void {
     this.authService.checkAccess();

    this.goldService.getCurrentGoldPrice()
      .subscribe((r: any) => {
        this.currentGoldPricePerGram = r.sell_price_per_gram;
      });
    this.getWalletAmount();
  }

  getWalletAmount(): void {
    this.api.get(`user/money-wallet/amount`)
      .subscribe((r: any) => {
        this.walletAmount = r.amount;
      });
  }

  moneyWallet(e: any) {
    this.form.controls["enteredWalletAmount"].clearValidators();

    if (e.target.checked) {
      this.walletAmountInput = true;
      this.form.controls["enteredWalletAmount"].setValidators([Validators.required, Validators.min(1)]);
    }
    if (!e.target.checked) {
      this.form.get('enteredWalletAmount').setValue('');
      this.walletAmountInput = false;
      this.addCharges();
    }
  }

  enteredWalletAmountChange() {
    const amount: number = this.form.get('amount').value;
    // if(amount == 0 || !amount){
    //     alert('First enter amount to Buy Gold');
    // }
    if (amount >= 50) {
      this.addCharges();
      let enteredWalletAmount = 0;
      if (this.form.get('enteredWalletAmount').value) {
        enteredWalletAmount = this.form.get('enteredWalletAmount').value;
      }

      if (eval(enteredWalletAmount.toString()) > this.walletAmount) {
        alert('Available amount in your Money Wallet is ' + this.walletAmount);
        this.form.get('enteredWalletAmount').setValue('');
        this.addCharges();
        return;
      }

      if (eval(enteredWalletAmount.toString()) > this.amountPayableIncludingCharges) {
        alert('You can\'t enter more than Payable Amount');
        this.form.get('enteredWalletAmount').setValue('');
        this.addCharges();
        return;
      }

      // this.addCharges();
      this.amountPayableIncludingCharges =
        this.amountPayableIncludingCharges - eval(enteredWalletAmount.toString());
      if (enteredWalletAmount == 0 || !enteredWalletAmount) {

        this.addCharges();
        return;
      }
    }


  }

  onSubmit(): void {
    this.submitted = true;
    if (this.form.invalid) {
      this.isSubmitting = false;
      return;
    }

    this.api.get(`user/referral/referral-validation?referralCode=` + this.form.get('referralCode').value)
      .subscribe((res: any) => {
          if (res) {
            this.priceLockBuyGold();
          }
        },
        (err: HttpErrorResponse) => {
          this.errorMessage = '';
          this.errors = err.error.errors;
          if (err.error.message.length) {
            this.errorMessage = err.error.message.toString();
          }
          this.isSubmitting = false;
        });

  }


  priceLockBuyGold() {
    const enteredWalletAmount = this.form.get('enteredWalletAmount').value;

    if (eval(enteredWalletAmount.toString()) > this.walletAmount) {
      alert('Available amount in your Money Wallet is ' + this.walletAmount);
      return;
    }


    if (localStorage.getItem('coupon') !== null) {
      const amount = this.form.get('amount').value;
      const minimumTransactionAmount = JSON.parse(localStorage.getItem('coupon')).minimumTransactionAmount;

      if (Number(amount) < Number(minimumTransactionAmount)) {
        this.isGreaterThanCouponAmount = true;
        return;
      } else {
        this.isGreaterThanCouponAmount = false;
      }
    }
    this.isSubmitting = true;

    this.api.get(`user/wallet/gold/price/lock?price=` + this.currentGoldPricePerGram)
      .subscribe((res: any) => {
          const quantityInGrams: number = this.form.get('quantity').value;
          var coupon: any = '';
          if (localStorage.hasOwnProperty('coupon')) {
            const couponData = localStorage.getItem('coupon');
            coupon = JSON.parse(couponData).coupon_code;
          }

          // if(eval(this.amountPayableIncludingCharges.toString()) == 0){
          //     alert(this.amountPayableIncludingCharges);
          //     window.location.href = '/transactions';
          //     return;
          // }

          if (eval(this.amountPayableIncludingCharges.toString()) == 0) {
            const amount = this.form.get('amount').value;
            const referralCode = this.form.get('referralCode').value;
            const data = {amount, enteredWalletAmount, coupon, referralCode};
            this.api.post(`user/wallet/buy-gold-with-money-wallet`, data)
              .subscribe((r: any) => {
                if (r.processed == true) {
                  this.isSubmitting = false;
                  sessionStorage.setItem('desc', r.description);
                  window.location.href = '/gold/transaction/' + r.transactionId;
                  return;
                } else {
                  this.isSubmitting = false;
                  alert('Transaction Failed');
                  return;
                }
              });
          }

          if (eval(this.amountPayableIncludingCharges.toString()) !== 0) {
            this.goldService.purchase(quantityInGrams, this.form.get('amount').value, this.amountPayableIncludingCharges, coupon, enteredWalletAmount, this.form.get('referralCode').value);
            this.isSubmitting = false;
          }

        },
        (err: HttpErrorResponse) => {
          this.errorMessage = '';
          this.errors = err.error.errors;
          if (err.error.message.length) {
            this.errorMessage = err.error.message.toString();
          }
          this.isSubmitting = false;
        });
  }

  addCharges(): void {
    const amount: number = this.form.get('amount').value;
    // const amountWithGst: number = ((amount / 100) * this.gstPercentage);
    const amountWithGst: number = 0;
    const totalAmount = eval(amount.toString()) + eval(amountWithGst.toString());
    this.amountPayableIncludingCharges = totalAmount.toFixed();
    this.amountWithGstAmount = eval(amountWithGst.toString());
  }

  onAmountChange(): void {
    this.submitted = true;
    let quantityInGrams: number;
    const amount: number = this.form.get('amount').value;

    // console.log(!this.form.get('amount').value);

    if (amount < 0 || !amount) {
      this.form.get('amount').setValue('');
      this.form.get('quantity').setValue('');
    }

    if (localStorage.getItem('coupon') !== null) {

      const minimumTransactionAmount = JSON.parse(localStorage.getItem('coupon')).minimumTransactionAmount;

      if (Number(amount) < Number(minimumTransactionAmount)) {
        this.isGreaterThanCouponAmount = true;
      } else {
        this.isGreaterThanCouponAmount = false;
      }
    }

    if (amount > 0) {
      this.addCharges();
      quantityInGrams = this.goldService.amountToQuantity(amount, this.currentGoldPricePerGram);
    } else {
      quantityInGrams = 0;
    }
    this.form.get('quantity').setValue(quantityInGrams.toFixed(15));
    this.enteredWalletAmountChange();
  }

  onQuantityChange(): void {
    this.submitted = true;
    let amountPayable: number;
    const quantityInGrams: number = this.form.get('quantity').value;

    if (quantityInGrams < 0) {
      this.form.get('quantity').setValue('');
    }

    if (quantityInGrams > 0) {
      amountPayable = this.goldService.calculatePrice(quantityInGrams, this.currentGoldPricePerGram);
    } else {
      amountPayable = 0;
    }

    this.form.get('amount').setValue(amountPayable.toFixed(2));
    this.addCharges();
    this.enteredWalletAmountChange();
  }

  get f() {
    return this.form.controls;
  }


  referralCodeExists(event) {
    console.log(event.target.value.length);
    if (event.target.value.length > 6) {
      this.api.get(`user/referral/referral-validation?referralCode=` + event.target.value)
        .subscribe((res: any) => {

          },
          (err: HttpErrorResponse) => {
            this.errorMessage = '';
            this.errors = err.error.errors;
            if (err.error.message.length) {
              this.errorMessage = err.error.message.toString();
            }
            this.isSubmitting = false;
          });
    }
  }
}