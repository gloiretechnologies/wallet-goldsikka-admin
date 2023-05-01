import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/api.service';
import { GoldService } from 'src/app/gold/gold.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import {HttpErrorResponse} from '@angular/common/http';
import { environment } from 'src/environments/environment';
import {ActivatedRoute} from '@angular/router';
import {NzNotificationService} from 'ng-zorro-antd/notification';
import { PaymentService } from 'src/app/_services/payment.service';
import { AuthenticationService } from 'src/app/_services/authentication/authentication.service';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss']
})
export class CheckoutComponent implements OnInit {
   math = Math;
  response: any;
  arr: any;
orderId: string = null;
    isPayAmount: boolean;
    submitted: boolean;
    isEventValid: boolean;
    isPayEvent: boolean;
    schemeTransactionModal: boolean;
    organization: any = [];
    qrCodeImage: any = [];
    currentGoldPricePerGram: number;
    gstPercentage: number = environment.gstPercentage;
    amountPayableIncludingCharges: number;
    errorMessage: string;
    errors: object = {};
    isPriceLock: string;
    isSubmitting: boolean;
    walletAmount: number;
  showUserImageModal: boolean;
  amountWithGstAmount: number;
  silver_liveprice:any;
  walletAmountInput: boolean;
    form: FormGroup = new FormGroup({
        amount: new FormControl('', [Validators.required, Validators.min(1), Validators.maxLength(10)]),
        enteredWalletAmount: new FormControl(''),
        pid: new FormControl(''),
        liveprice: new FormControl(''),
        productscount: new FormControl(''),
    });
  amount: number;
  pcount: number;
  live: any;
  p: any;
  a: any;
  pidslist: any;
  getStates: any;
  final: any;
  myString: any;
  len: any;
  ma: any;
  live_price24: any;
  myString2: any;
  size: any;
  gold24k: any;
  silver24k: any;
  stonearray: any;

  constructor(private api: ApiService,
    private goldService: GoldService,
    private route: ActivatedRoute,
    private paymentService: PaymentService,
    private notification: NzNotificationService,
    private authService: AuthenticationService
    ) { }

  ngOnInit(): void {
     this.authService.checkAccess();

    this.goldService.getCurrentGoldPrice()
   
      .subscribe((r: any) => {
        this.currentGoldPricePerGram = r.sell_price_per_gram;
      });
    this.getInfo();
    
    this.getWalletAmount();
this.addCharges()
  }
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
addCharges(): void {
  const amount: number = this.form.get('amount').value;
    const amountWithGst: number = ((amount / 100) * this.gstPercentage);
    const totalAmount = this.ma;
    this.amountPayableIncludingCharges = totalAmount.toFixed();
    this.amountWithGstAmount = eval(amountWithGst.toString())
   
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
hideSchemeTransactionModal(){
    this.schemeTransactionModal = false;

}
openVerticallyCentered()
{
   this.schemeTransactionModal = true;
}
get f() {
    return this.form.controls;
  }

onSubmit(): void {
  console.log(this.form.value)
    this.submitted = true;
    if (this.form.invalid) {
      return;
    }

    this.isSubmitting = true;
    const payment_id = this.route.snapshot.paramMap.get('id');
    this.api.get(`user/wallet/gold/price/lock?price=` + this.currentGoldPricePerGram)
      .subscribe((res: any) => {
          const enteredWalletAmount = this.form.get('enteredWalletAmount').value;
          if (eval(enteredWalletAmount.toString()) > this.walletAmount) {
            alert('Available amount in your Money Wallet is ' + this.walletAmount);
            return;
          }

          if (eval(this.amountPayableIncludingCharges.toString()) == 0) {

            console.log(`wallet`)
            const amounts = this.form.get('amount').value;
            const pid =this.myString;
            const live_price = this.form.get('liveprice').value;
            const no_of_products= this.pcount=this.form.get('productscount').value;;
            const amount=Math.round(this.amountPayableIncludingCharges);
             const size=this.myString2;
         const live_price24=this.gold24k;
         const silver_liveprice=this.silver24k;
         const stoneid=this.stonearray;
            const data = {enteredWalletAmount,pid,live_price,no_of_products,size,live_price24,silver_liveprice,stoneid};

            console.log('data',data)
            this.api.post(`ecom/checkout/moneywallet`, data)
              .subscribe((r: any) => {
                  console.log(r)

                if (r.processed == true) {
                  this.isSubmitting = false;
                  let description=r.message
                  sessionStorage.setItem('desc',description );
                  window.location.href ='/ecommerce/paymentsuccess/'+'222';
                  return;
                } else {
                  this.isSubmitting = false;
                  alert('Transaction Failed');
                  return;
                }
              });
          }
       
          this.amount=this.amountPayableIncludingCharges;
         this.live=this.form.get('liveprice').value;
         this.pcount=this.form.get('productscount').value;
         this.p=this.myString;
         this.size=this.myString2;
         this.live_price24=this.gold24k;
         this.silver_liveprice=this.silver24k;
         const stoneid=this.stonearray;

         console.log('sil',this.silver24k)

         console.log(this.pcount)
          //  this.paymentService.ecomPostingRazorpay(this.form.get('amount').value,this.form.get('productscount').value,this.form.get('liveprice').value,this.form.get('pid').value,this.amountPayableIncludingCharges,enteredWalletAmount);
          
          if (eval(this.amountPayableIncludingCharges.toString()) !== 0) {

            
            this.paymentService.ecomPostingRazorpay(this.amount, this.live,this.pcount,this.p,enteredWalletAmount,this.size,this.live_price24,this.silver_liveprice,stoneid);
            this.isSubmitting = false;
          }
        },
        (err: HttpErrorResponse) => {
          this.errorMessage = '';
          this.errors = err.error.errors;
          if (err.error.message && err.error.message.length) {
            this.errorMessage = err.error.message.toString();
          }
        });
  }
 
enteredWalletAmountChange() {
    const amount: number = this.form.get('amount').value;
   
    if (amount >= 100) {
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
        Math.round(this.response.payable_amount) - eval(enteredWalletAmount.toString());

      if (enteredWalletAmount == 0 || !enteredWalletAmount) {
        this.addCharges();
      }
    }
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
     getWalletAmount(): void {
    this.api.get(`user/money-wallet/amount`)
      .subscribe((r: any) => {
        this.walletAmount = r.amount;
        this.addCharges()

      });
     
  }
   getInfo() {
    this.api.get(`ecom/checkout`)
      .subscribe((r: any) => {

        this.response = r;
        console.log('response',this.response)
        this.ma=r.payable_amount;
        
        const myClonedArray  = Object.assign([], this.response);
       this.len=myClonedArray.lenght;

       this.arr=myClonedArray;
         this.gold24k=this.arr[0].liveprice24;
        this.silver24k=this.arr[0].silverprice;
      console.log(`clone`,this.arr)
      var res = this.arr.map(s=>s.pid);
      var stonesids = this.arr.map(s=>s.stoneid);
      var res1 = this.arr.map(s=>s.size);

this.stonearray = stonesids.toString();
this.myString = res.toString();
this.myString2 = res1.toString();
  console.log(`pids`, this.myString,this.myString2);
  console.log(`stineids`, this.stonearray);
        this.addCharges()
      });
  }
}