import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { ApiService } from "../../../api.service";
import { ActivatedRoute, Router } from "@angular/router";
import { GoldService } from "../../../gold/gold.service";
import { HttpErrorResponse } from "@angular/common/http";
import { SchemesService } from "../../schemes.service";
import { environment } from "../../../../environments/environment";
import { AuthenticationService } from 'src/app/_services/authentication/authentication.service';
import { log } from 'console';
@Component({
  selector: 'app-jewellery-form-component',
  templateUrl: './jewellery-form.component.html',
  styleUrls: ['./jewellery-form.component.scss']
})
export class JewelleryFormComponent implements OnInit {

  errorMessage: string;
  successMessage: string;
  isSubmitting: boolean;
  errors: object = {};
  submitted: boolean;
  quantityInGrams: number;
  currentGoldPricePerGram: number;
  gstPercentage: number = environment.gstPercentage;
  schemeCalculationType: string;
  schemes: any = [];
  schemeValues: any = [];
  walletAmount: any;
  walletAmountInput: boolean = false;
  finalAmount: number;
  inputParam: any = { 'isJewellery': true };
  form: FormGroup = new FormGroup({
    // emi_grams: new FormControl('', [Validators.min(10), Validators.max(1000)]),
    total_installments: new FormControl('12', [Validators.required]),
    amount: new FormControl('', [Validators.required]),
    agree: new FormControl('', [Validators.required]),
    couponamount: new FormControl(''),
    referralCode: new FormControl(''),
    enteredWalletAmount: new FormControl(''),
  });
  isGreaterThanCouponAmount: boolean=false;


  constructor(
    private api: ApiService,
    private route: ActivatedRoute,
    private router: Router,
    private schemeService: SchemesService,
    private goldService: GoldService,
    private authService: AuthenticationService,

  ) {
  }

  ngOnInit(): void {
     this.authService.checkAccess();

    this.getSchemeIdList(this.route.snapshot.paramMap.get('id'));
    this.getSchemeCalculationAmount();
    // get 22 carat Price
    this.goldService.getCurrent22CarartGoldPrice()
      .subscribe((r: any) => {

        this.currentGoldPricePerGram = r.sell_price_per_gram;
      console.log("current gold 22", this.currentGoldPricePerGram)
      });
    this.getWalletAmount();
    this.isGetLock();
    
  }

  /**
   *
   */
 onlyNumberKey(event:any) {
    return (event.charCode == 8 || event.charCode == 0) ? null : event.charCode >= 48 && event.charCode <= 57;
}
//for Decimal you can use this as
onlyDecimalNumberKey(event:any) {
    let charCode = (event.which) ? event.which : event.keyCode;
    if (charCode != 46 && charCode > 31
        && (charCode < 48 || charCode > 57))
        return false;
    return true;
}

  onSubmit(): void {

    this.api.get(`user/wallet/gold/price/lock?price=${this.currentGoldPricePerGram}&carat=22`)
            
    .subscribe((r: any) => {
  console.log("logapi", r)
    });

        this.submitted = true;


    if (this.form.invalid) {
      return;
    }
    const enteredWalletAmount = this.form.get('enteredWalletAmount').value;
    if (eval(enteredWalletAmount.toString()) > this.walletAmount) {
      alert('Available amount in your Money Wallet is ' + this.walletAmount);
      return;
    }
    if (this.walletAmountInput && enteredWalletAmount == 0) {
      alert('Please Enter Wallet Amount');
      return;
    }
    // TESTING START BY ME
   
    if (localStorage.getItem('coupon') !== null) {
      let amount = this.form.get('amount').value;
      let minimumTransactionAmount = JSON.parse(localStorage.getItem('coupon')).minimumTransactionAmount;

      if (Number(amount) <  Number(minimumTransactionAmount)) {
        this.isGreaterThanCouponAmount = true;
        return;
      } else {
        this.isGreaterThanCouponAmount = false;
      }
      
    }
   // TESTING END BY ME

    this.isSubmitting = true;
    this.api.get(`user/referral/referral-validation?referralCode=` + this.form.get('referralCode').value)
      .subscribe((res: any) => {
        if (res) {

          if (eval(this.finalAmount.toString()) == 0) {
            var coupon: any = '';
            if (localStorage.hasOwnProperty('coupon')) {
              const couponData = localStorage.getItem('coupon');
              coupon = JSON.parse(couponData).coupon_code;
            }
            this.isSubmitting = true;
            const total_installments = this.form.get('total_installments').value ? this.form.get('total_installments').value : '0';
            const amount = this.form.get('amount').value ? this.form.get('amount').value : '0';
            const referralCode = this.form.get('referralCode').value;
            const data = { total_installments, amount, coupon, enteredWalletAmount, referralCode };


            this.api.post(`user/schemes/${this.route.snapshot.paramMap.get('id')}/scheme-with-money-wallet`, data)
              .subscribe((r: any) => {
                if (r.processed == true) {
                  this.isSubmitting = false;
                  // console.log(r.description);

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

          if (eval(this.finalAmount.toString()) !== 0) {
            var coupon: any = '';
            if (localStorage.hasOwnProperty('coupon')) {
              const couponData = localStorage.getItem('coupon');
              coupon = JSON.parse(couponData).coupon_code;
            }

            //  this.form.controls.couponamount.setValue('coupon');

            // this.form.setValue({
            //   couponamount:coupon,

            // });
            // this.form.get('user').setValue(
            // this.question.user
            // )
            // this.currentGoldPricePerGram
          

      
            this.schemeService.purchase(this.finalAmount, this.form.value, this.route.snapshot.paramMap.get('id'));
            this.isSubmitting = false;
          }
        
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

  getSchemeIdList(id): void {
    this.api.get(`user/schemes/` + id + `/content`)
      .subscribe((r: any) => {
        this.schemes = r;
        this.schemeCalculationType = this.schemes.scheme_calculation_type;
      });
  }

  getSchemeCalculationAmount(): void {
    let amount = this.form.get('amount').value;
    this.inputParam.amount = amount;
    this.inputParam.tenure = '12';
    //  okay by me
    console.log ("user selected amount",this.inputParam.amount);
    if (amount > 0) {

      this.api.get(`user/schemes/` + this.route.snapshot.paramMap.get('id') + `/calculations?amount=` + amount)
        .subscribe((r: any) => {
          this.schemeValues = r;
          this.finalAmount = r.finalAmount;
          this.quantityInGrams = r.gramsEmi;

        });
    }
  }

  get f() {
    return this.form.controls;
  }


  enteredWalletAmountChange() {
    const amount = this.form.get('amount').value ? this.form.get('amount').value : '0';
    const tenure = this.form.get('total_installments').value ? this.form.get('total_installments').value : '0';
    const finalAmount = this.schemeValues.finalAmount;
    if (amount > 0 && tenure > 0) {
      const enteredWalletAmount = this.form.get('enteredWalletAmount').value ? this.form.get('enteredWalletAmount').value : '0';
      this.addCharges();
      if (eval(enteredWalletAmount.toString()) > this.walletAmount) {
        alert('Available amount in your Money Wallet is ' + this.walletAmount);
        this.form.get('enteredWalletAmount').setValue('');
        this.addCharges();
        return;
      }

      if (eval(enteredWalletAmount.toString()) > finalAmount) {
        console.log(eval(enteredWalletAmount.toString()), this.schemeValues.finalAmount);
        alert('You can\'t enter more than Payable Amount');
        this.form.get('enteredWalletAmount').setValue('');
        this.addCharges();
        return;
      }
      if (enteredWalletAmount == 0 || !enteredWalletAmount) {
        alert('Please Enter Wallet Amount');
        this.addCharges();
      }
    } else {
      alert('please Select Amount');
      this.form.get('enteredWalletAmount').setValue('');
    }
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

  addCharges() {
    const enteredWalletAmount = this.form.get('enteredWalletAmount').value ? this.form.get('enteredWalletAmount').value : '0';

    this.finalAmount = this.schemeValues.finalAmount- enteredWalletAmount;
  }

  onchange(value) {
    if (!value) {
      if (!isNaN(this.schemeValues.couponAmount)) {
        let couponAmt = parseFloat(this.schemeValues.couponAmount);
        this.finalAmount += couponAmt;
        this.schemeValues.finalAmount += couponAmt;
        this.schemeValues.couponAmount = 0;
      }

    } else {
      this.schemeValues = value;
      this.finalAmount = value.finalAmount;
    }
  }




  isGetLock(): void {
   
  }
}