import {Component, OnInit} from '@angular/core';
import {environment} from "../../../environments/environment";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {ApiService} from "../../api.service";
import {GoldService} from "../../gold/gold.service";
import {ActivatedRoute} from "@angular/router";
import {HttpErrorResponse} from "@angular/common/http";
import { AuthenticationService } from 'src/app/_services/authentication/authentication.service';

@Component({
  selector: 'app-invited-event-pay',
  templateUrl: './invited-event-pay.component.html',
  styleUrls: ['./invited-event-pay.component.scss']
})
export class InvitedEventPayComponent implements OnInit {

  isPayAmount: boolean;
  submitted: boolean;
  isEventValid: boolean;
  isPayEvent: boolean;
  isMarriageType: boolean;
  isOthersType: boolean;
  amountWithGstAmount: number;
  events: any = [];
  qrCodeImage: any = [];
  currentGoldPricePerGram: number;
  gstPercentage: number = environment.gstPercentage;
  amountPayableIncludingCharges: number;
  errorMessage: string;
  errors: object = {};
  isPriceLock: string;
  isSubmitting: boolean;
  walletAmount: number;
  showUserImageModal:boolean;
  showUserImageModal1:boolean;
  walletAmountInput: boolean;
  form: FormGroup = new FormGroup({
    quantity: new FormControl('', [Validators.required, Validators.max(30)]),
    amount: new FormControl('', [Validators.required, Validators.min(100), Validators.maxLength(10)]),
    enteredWalletAmount: new FormControl(''),
  });

  constructor(
    private api: ApiService,
    private goldService: GoldService,
    private route: ActivatedRoute,
    private authService: AuthenticationService,

  ) {
  }

  /**
   *
   */
  ngOnInit(): void {
     this.authService.checkAccess();

    this.goldService.getCurrentGoldPrice()
      .subscribe((r: any) => {
        this.currentGoldPricePerGram = r.sell_price_per_gram;
      })
    this.getEventValidation();
    this.getWalletAmount();
  }


  getWalletAmount(): void {
    this.api.get(`user/money-wallet/amount`)
      .subscribe((r: any) => {
        this.walletAmount = r.amount;
      });
  }
  /**
   *
   */
  onSubmit(): void {
    this.submitted = true;

    if (this.form.invalid) {
      return;

    }
    this.isSubmitting = true;
    const eventId = this.route.snapshot.paramMap.get('id');

    const enteredWalletAmount = this.form.get('enteredWalletAmount').value;
    if (eval(enteredWalletAmount.toString()) > this.walletAmount) {
      alert('Available amount in your Money Wallet is ' + this.walletAmount);
      return;
    }

    this.api.get(`user/wallet/gold/price/lock?price=` + this.currentGoldPricePerGram)
      .subscribe((res: any) => {
          const quantityInGrams: number = this.form.get('quantity').value;
          console.log(eval(this.amountPayableIncludingCharges.toString()));
          if (eval(this.amountPayableIncludingCharges.toString()) == 0) {
            const amount = this.form.get('amount').value;
            const data = {amount, enteredWalletAmount, eventId};

            this.api.post(`user/events/gift/money-wallet`, data)
              .subscribe((r: any) => {
                if (r.processed == true) {
                  this.isSubmitting = false;
                  alert(r.description);
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
            this.goldService.eventPurchase(this.form.get('amount').value, this.amountPayableIncludingCharges, eventId, enteredWalletAmount);
            this.isSubmitting = false;
          }
        },
        (err: HttpErrorResponse) => {
          this.errorMessage = '';
          this.errors = err.error.errors;
          if (err.error.message && err.error.message.length) {
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
    this.amountPayableIncludingCharges = amount;
    this.amountWithGstAmount = eval(amountWithGst.toString());
  }

  onAmountChange(): void {
    this.submitted = true;
    let quantityInGrams: number;
    const amount: number = this.form.get('amount').value;

    if (amount < 0) {
      this.form.get('amount').setValue('');
      this.form.get('quantity').setValue('');
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


  getEventValidation() {
    this.api.get(`user/events/get/` + this.route.snapshot.paramMap.get('id'))
      .subscribe((res: any) => {
          this.events = res;
          if (res.event_type === 'MRG') {
            this.isMarriageType = true;
          }
          if (res.event_type === 'OTH') {
            this.isOthersType = true;
          }
        },
        (err: HttpErrorResponse) => {
          this.isSubmitting = false;
          this.errorMessage = '';
          this.errors = {};
          if (err.error.errors) {
            this.errors = err.error.errors;
          }

          if (err.error.message.length) {
            this.errorMessage = err.error.message.toString();
          }
        });

  }

  enteredWalletAmountChange() {
    const amount: number = this.form.get('amount').value;
    // if(amount == 0 || !amount){
    //     alert('First enter amount to Buy Gold');
    // }
    if (amount >= 50) {
      const enteredWalletAmount = this.form.get('enteredWalletAmount').value;
      this.addCharges();

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
      }
    }
  }


  moneyWallet(e: any) {
    this.form.controls["enteredWalletAmount"].clearValidators();

    if (e.target.checked) {
      this.walletAmountInput = true;
      this.form.controls["enteredWalletAmount"].setValidators([Validators.required,Validators.min(1)]);
    }
    if (!e.target.checked) {
      this.form.get('enteredWalletAmount').setValue('');
      this.walletAmountInput = false;
      this.addCharges();
    }
  }
  onImage(){
    this.showUserImageModal=true;
  }
  onImage1(){
    this.showUserImageModal1=true;
    console.log(this.showUserImageModal1);
  }

  hideUserImageModal() {
    this.showUserImageModal = false;
  }
  hideUserImageModal1() {
    this.showUserImageModal1 = false;
  }
}
