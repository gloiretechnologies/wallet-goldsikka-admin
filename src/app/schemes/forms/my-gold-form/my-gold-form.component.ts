import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {ApiService} from '../../../api.service';
import {ActivatedRoute, Router} from '@angular/router';
import {SchemesService} from '../../schemes.service';

import {GoldService} from '../../../gold/gold.service';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {environment} from '../../../../environments/environment';
import { AuthenticationService } from 'src/app/_services/authentication/authentication.service';

@Component({
  selector: 'app-my-gold-form-component',
  templateUrl: './my-gold-form.component.html',
  styleUrls: ['./my-gold-form.component.scss']
})
export class MyGoldFormComponent implements OnInit {

  maxErrorMsg: boolean;
  minErrorMsg: boolean;
  errorMessage: string;
  successMessage: string;
  isSubmitting: boolean;
  errors: object = {};
  submitted: boolean;
  quantityInGrams: number;
  currentGoldPricePerGram: number;
  schemeCalculationType: string;
  schemes: any = [];
  walletAmount: any;
  walletAmountInput: boolean = false;
  gstPercentage: number = environment.gstPercentage;
  schemeValues: any = [];
  finalAmount: number;
  inputParam:any={'isGold':true};

  form: FormGroup = new FormGroup({
    emi_grams: new FormControl('', [Validators.required, Validators.min(10), Validators.max(30)]),
    total_installments: new FormControl('', [Validators.required]),
    agree: new FormControl('', [Validators.required]),
    referralCode: new FormControl(''),
    couponamount:new FormControl(''),
    enteredWalletAmount: new FormControl(''),
  });
  isGreaterThanCouponAmount: boolean = false;

  constructor(
    private api: ApiService,
    private route: ActivatedRoute,
    private router: Router,
    private goldService: GoldService,
    private schemeService: SchemesService,
    private http: HttpClient,
    private authService: AuthenticationService,

  ) {
  }

  ngOnInit(): void {
     this.authService.checkAccess();

    this.getSchemeIdList(this.route.snapshot.paramMap.get('id'));
    this.getSchemeCalculationAmount();

    // get 22 carat Price
    this.goldService.getCurrentGoldPrice()
      .subscribe((r: any) => {

        this.currentGoldPricePerGram = r.sell_price_per_gram;
      });
    this.getWalletAmount();
  }

  /**
   *
   */
  onSubmit(): void {
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
              const emi_grams = this.form.get('emi_grams').value ? this.form.get('emi_grams').value : '0';
              const referralCode = this.form.get('referralCode').value;
              const data = {total_installments, emi_grams,coupon, enteredWalletAmount, referralCode};
              this.api.post(`user/schemes/${this.route.snapshot.paramMap.get('id')}/scheme-with-money-wallet`, data)
                .subscribe((r: any) => {
                  if (r.processed == true) {
                    this.isSubmitting = false;
                    // alert(r.description);
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
        
        // if (localStorage.getItem('coupon') !== null) {
        //   const amount = this.form.get('amount').value;
        //   const minimumTransactionAmount = JSON.parse(localStorage.getItem('coupon')).minimumTransactionAmount;
    
        //   if (Number(amount) < Number(minimumTransactionAmount)) {
        //     this.isGreaterThanCouponAmount = true;
        //     return;
        //   } else {
        //     this.isGreaterThanCouponAmount = false;
        //   }
        // }
        this.isSubmitting = true;

  }

  getSchemeIdList(id): void {
    this.api.get(`user/schemes/` + id + `/content`)
      .subscribe((r: any) => {
        this.schemes = r;
        this.schemeCalculationType = this.schemes.scheme_calculation_type;
      });
  }
  



  getSchemeCalculationAmount(): void {
    const tenure = this.form.get('total_installments').value ? this.form.get('total_installments').value : '0';
    const grams = this.form.get('emi_grams').value ? this.form.get('emi_grams').value : '0';
    this.inputParam.grams=grams;
    this.inputParam.tenure=tenure;
    //this.inputParam.amount=amount;



    if (grams > 0 && grams < 10) {
      this.minErrorMsg = true;
      this.maxErrorMsg = false;
    }

    if (grams > 30) {
      this.maxErrorMsg = true;
      this.minErrorMsg = false;
    }

    if (parseInt(grams) === 0 || (grams >= 10 && grams <= 30)) 
    {
      this.inputParam.grams=grams;
      this.maxErrorMsg = false;
      this.minErrorMsg = false;
    }


    if (tenure > 0 && grams > 0) {
      this.api.get(`user/schemes/` + this.route.snapshot.paramMap.get('id') + `/calculations?tenure=` + tenure + `&grams=` + grams)
        .subscribe((r: any) => {
          this.currentGoldPricePerGram = 1000;
          this.schemeValues = r;
          this.finalAmount = r.finalAmount;
        });
    }
  }
  get f() {
    return this.form.controls;
  }


  enteredWalletAmountChange() {
    const grams = this.form.get('emi_grams').value ? this.form.get('emi_grams').value : '0';
    const tenure = this.form.get('total_installments').value ? this.form.get('total_installments').value : '0';
    const finalAmount = this.schemeValues.finalAmount;
    if (grams >= 10 && grams <= 30 && tenure > 0) {

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
      alert('Please select grams and tenure');
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

    this.finalAmount = this.schemeValues.finalAmount - enteredWalletAmount;
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

}
