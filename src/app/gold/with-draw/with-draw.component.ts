import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../api.service';
import { GoldService } from '../gold.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { HttpErrorResponse } from "@angular/common/http";
import { AccountService } from "../../account/account.service";
import { AuthenticationService } from 'src/app/_services/authentication/authentication.service';


@Component({
  selector: 'app-with-draw',
  templateUrl: './with-draw.component.html',
  styleUrls: ['./with-draw.component.scss']
})
export class WithDrawComponent implements OnInit {
  
  schemeTransactionModal: boolean;
  submitted: boolean;
    isSubmitting: boolean;

  errorMessage: string;
  errors: object = {};
  currentBalance: object = {};
  currentGoldPricePerGram: number;
  transferCompleted: boolean;
  isPriceLock: string;
  amountPayable: number;
  fractionamount: number;
  isAddress: boolean;
  grams: number;
  walletAmount: any;
  buttonDisabled: boolean;
  walletAmountInput: boolean = false;
  form = new FormGroup({
    grams: new FormControl('', [Validators.required, Validators.max(30)]),
    amount: new FormControl('', [Validators.required]),
    fraction_prices: new FormControl(''),
    enteredWalletAmount: new FormControl('', [Validators.pattern('^[0-9]\.*$')]),
    purity: new FormControl(24, [Validators.required]), // default
    
  });
  form1=new FormGroup({
    message: new FormControl('',[Validators.required]),
    rating: new FormControl('',[Validators.required])
  })
  description: string;
  schemeTransactionModal_after: boolean;
  constructor(
    private api: ApiService,
    private goldService: GoldService,
    private accountService: AccountService,
    private authService: AuthenticationService,

    
  ) {
  }

  ngOnInit(): void {
    
     this.authService.checkAccess();

    this.goldService.getCurrentGoldPrice()
      .subscribe((r: any) => {
        this.currentGoldPricePerGram = r.sell_price_per_gram;
      });
    this.getAvailableBalance();
    this.getWalletAmount();
    this.schemeTransactionModal = true;

  }
  buttonCount = 0;
  studentCount = 0;
check(){
  this.form.invalid && this.buttonCount===1
}

  enteredWalletAmountChange() {
    const fractionamount = this.fractionamount;

    const enteredWalletAmount = this.form.get('enteredWalletAmount').value ? this.form.get('enteredWalletAmount').value : '0';
    this.addCharges();
    if (eval(enteredWalletAmount.toString()) > this.walletAmount) {
      alert('Available amount in your Money Wallet is ' + this.walletAmount);
      this.form.get('enteredWalletAmount').setValue('');
      this.addCharges();
      return;
    }

    if (eval(enteredWalletAmount.toString()) > this.fractionamount) {
      console.log(eval(enteredWalletAmount.toString()), this.fractionamount);
      alert('You can\'t enter more than Payable Amount');
      this.form.get('enteredWalletAmount').setValue('');
      this.addCharges();
      return;
    }
    if (enteredWalletAmount == 0 || !enteredWalletAmount) {
      alert('Please Enter Wallet Amount');
      this.addCharges();
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
    this.fractionamount = this.fractionamount - enteredWalletAmount;
  }
  onSubmit(): void {
     this.errorMessage = '';
     console.log(this.errorMessage)
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

    this.balanceValidation();
    this.isSubmitting = true;
  
  }


  onQuantityChange(): void {
    this.submitted = true;
    let amountPayable: number;
    const quantitySellGrams: number = this.form.get('grams').value;
    let fractionamount: number;
    if (quantitySellGrams < 0) {
      this.form.get('grams').setValue('');
    }
    if (quantitySellGrams > 0) {
      fractionamount = this.goldService.getcalculatePrice(quantitySellGrams, this.currentGoldPricePerGram);
      amountPayable = this.goldService.calculatePrice(quantitySellGrams, this.currentGoldPricePerGram);
    } else {
      amountPayable = 0;
    }
    this.form.get('fraction_prices').setValue(fractionamount.toFixed(2));

    this.form.get('amount').setValue(amountPayable.toFixed(2));
  }

  get f() {
    return this.form.controls;
  }

  getAvailableBalance() {
    this.accountService.getBalance()
      .subscribe((r: any) => {
        const balance = r['balance'];
        const grams = new Number(balance.inGrams);
        balance.inGrams = grams.toFixed(3);
        this.currentBalance = balance;
      })
  }
  balanceValidation() {
    
    this.api.post(`user/wallet/withdraw-validation`, this.form.value)
      .subscribe((res: any) => {
        this.goldPriceLock();
       
      },
        (err: HttpErrorResponse) => {
          
          this.isSubmitting = false;
          this.errorMessage = '';
          this.errors = {};
          if (err.error.errors) {
            this.errors = err.error.errors;


          }
          if (err.error.is_address === false) {
            this.isAddress = true;
          }

          if (err.error.message.length) {
            this.errorMessage = err.error.message.toString();
          }
      
        });


  }
  goldPriceLock() {
    this.api.get(`user/wallet/gold/price/lock?price=` + this.currentGoldPricePerGram)
      .subscribe((res: any) => {
        this.withdrawGoldOfUser();
       
        const data = this.fractionamount = this.form.get('fraction_prices').value;
        this.api.post(`user/wallet/redeem-gold-with-money-wallet`, this.form.value)
          .subscribe((r: any) => {
            this.goldService.withredeem(this.grams, this.amountPayable, this.fractionamount);
            

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
        //  this.withdrawGoldOfUser();    
      },
        (err: HttpErrorResponse) => {
          this.isSubmitting = false;
          this.errorMessage = '';
          this.errors = err.error.errors;
          if (err.error.message.length) {
            this.errorMessage = err.error.message.toString();
          }

        });
  }

  async withdrawGoldOfUser() {
    this.fractionamount = this.form.get('fraction_prices').value;
    this.amountPayable = this.form.get('amount').value;
    this.grams = this.form.get('grams').value;
    if (this.grams > 1.5 || this.walletAmountInput) {
   
      this.api.post(`user/wallet/gold/withdraw`, this.form.value)
        .subscribe((r: any) => {
          
          this.isSubmitting = false;
          this.transferCompleted = true;
          this.schemeTransactionModal = true;
          sessionStorage.setItem('desc', r.description);
         
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
    else {
      await this.goldService.withredeem(this.grams, this.amountPayable, this.fractionamount);
     
      this.isSubmitting = false;
      this.transferCompleted = false;

    }
    // sessionStorage.setItem('desc', r.description);

  }

  //popoversubmittion
  hideSchemeTransactionModal() {
    this.schemeTransactionModal = false;
    this.schemeTransactionModal_after=false
  }
  close() {
    this.schemeTransactionModal = false;
    this.schemeTransactionModal_after=false
  }

  onsubmit_form() {
    const data = this.form1.value;
    console.log(data);
    this.api.post(`user/testimonials/add`, data).subscribe((res: any) => {
      this.schemeTransactionModal = false;
      this.schemeTransactionModal_after=true;
    });
  }

}