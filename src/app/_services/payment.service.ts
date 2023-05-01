import {Injectable} from '@angular/core';
import {JavascriptService} from './javascript.service';
import {WindowRefService} from './window-ref.service';
import {environment} from '../../environments/environment';
import {ApiService} from '../api.service';
import {Router} from '@angular/router';
import {HttpErrorResponse} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {

  paymentProcessed: boolean;
  isSubmitting: boolean;
  transferCompleted: boolean;

  constructor(
    private jsService: JavascriptService,
    private winRef: WindowRefService,
    private api: ApiService,
    private router: Router,
  ) {
    this.jsService.injectJsScript(`https://checkout.razorpay.com/v1/checkout.js`);
  }

  /**
   * @param amount
   * @param data
   */
  charge(amount: number, data: object): void {
    this.payBuyGoldWithRazor(data['orderId'], data['amountExcludingCharges'], amount, data['coupon'], data['enteredWalletAmount'], data['referralCode']);
  }
  chargeredeem(quantityInGrams:number,fractionamount: number,amountPayable:number): void {
    console.log("amount",fractionamount);
    // console.log("data",data);
    this.payRedeemWithRazor(fractionamount,quantityInGrams,amountPayable);
    
  }
  payRedeemWithRazor(amount:number,grams:number,fraction:number){
 // const that = this;
    
 const options: any = {
  key: environment.razorPayApiKey,
  amount: (fraction * 100), // amount should be in paise format to display Rs 1255 without decimal point
  currency: 'INR',
  name: '', // company name or product name
  description: `${environment.app.name} Wallet redeem the gold`,  // product description
  image: '/assets/images/favicon.png', // company logo or product image
  // order_id: orderId, // order_id created by you in backend
  modal: {
    // We should prevent closing of the form when esc key is pressed.
    escape: false,
  },
  notes: {
    // include notes if any
  },
  theme: {
    color: '#131f37'
  }
};
options.handler = ((response, error) => {
  options.response = response;
  //  console.log(response);
  // console.log(options);
  // call your backend api to verify payment signature & capture transaction
  const data = {payment_id: null, amount,grams,fraction};
  if ('razorpay_payment_id' in response) {
    data.payment_id = response.razorpay_payment_id;
  }
  this.api.post(`user/wallet/gold/withdraw`, data)
    .subscribe((r: any) => {
        // console.log('r', r);
      if ('processed' in r) {
        this.api.post(`user/wallet/gold/withdraw`,r.data)


        // that.paymentProcessed = r.processed
        // that.router.navigate(['/gold/transaction', r.transactionId]);
      

        window.location.href = '/gold/transaction/' + r.transactionId;
          this.isSubmitting = false;
          this.transferCompleted = true;

    return
      }
    }, 
    (err: HttpErrorResponse) => {
      alert(err.error.errors.message);
      console.log("err",err);
      window.location.href = '/gold/withdraw';
      // window.location.href = '/redeem/withdraw';

    });
});
options.modal.ondismiss = (() => {
  // handle the case when user closes the form while transaction is in progress
  console.log('Transaction cancelled.');
});
const rzp = new this.winRef.nativeWindow.Razorpay(options);
rzp.open();







  }
  /**
   *
   * @param orderId
   * @param amount
   */
  payBuyGoldWithRazor(orderId: string, payAmount: number, amount: number, coupon, enteredWalletAmount, referralCode) { 
    // const that = this;
    
    const options: any = {
      key: environment.razorPayApiKey,
      amount: (payAmount * 100), // amount should be in paise format to display Rs 1255 without decimal point
      currency: 'INR',
      name: '', // company name or product name
      description: `${environment.app.name} Booking Account Purchase`,  // product description
      image: '/assets/images/favicon.png', // company logo or product image
      order_id: orderId, // order_id created by you in backend
      modal: {
        // We should prevent closing of the form when esc key is pressed.
        escape: false,
      },
      notes: {
        // include notes if any
      },
      theme: {
        color: '#131f37'
      }
    };
    options.handler = ((response, error) => {
      options.response = response;
      //  console.log(response);

      // call your backend api to verify payment signature & capture transaction
      const data = {payment_id: null, amount, coupon, enteredWalletAmount, referralCode};

      if ('razorpay_payment_id' in response) {
        data.payment_id = response.razorpay_payment_id;
      }
    

      this.api.post(`user/wallet/gold/purchase`, data)
        .subscribe((r: any) => {
          if ('processed' in r) {
            //  this.paymentProcessed = r.processed;
            // that.router.navigate(['/gold/transaction', r.transactionId]);
             localStorage.removeItem('coupon');
             sessionStorage.setItem('desc', r.description);
            //  console.log(r.description);
             window.location.href = '/gold/transaction/' + r.transactionId;


          }
        }, 
        (err: HttpErrorResponse) => {
          alert(err.error.errors.message);
          window.location.href = '/gold/buy';
        });
    });
    options.modal.ondismiss = (() => {
      // handle the case when user closes the form while transaction is in progress
      console.log('Transaction cancelled.');
    });
    const rzp = new this.winRef.nativeWindow.Razorpay(options);
    rzp.open();
  }

  /**
   * @param amount
   * @param data
   */
  schemeCharge(amount: number, data: object): void {
    this.paySchemeWithRazor(data, amount);
  }

  /**
   *
   * @param orderId
   * @param amount
   */
  paySchemeWithRazor(data: object, finalAmount: number) {
    const emi_grams = data['data']['emi_grams'];
    const total_installments = data['data']['total_installments'];
    const amount = data['data']['amount'];
    const id = data['id'];
    const referralCode = data['data']['referralCode'];
    const walletAmount = data['data']['enteredWalletAmount'];
    // const that = this;
    const options: any = {
      key: environment.razorPayApiKey,
      amount: (finalAmount * 100), // amount should be in paise format to display Rs 1255 without decimal point
      currency: 'INR',
      name: '', // company name or product name
      description: `${environment.app.name} Booking Account Purchase`,  // product description
      image: '/assets/images/favicon.png', // company logo or product image
      order_id: data['orderId'], // order_id created by you in backend
      modal: {
        // We should prevent closing of the form when esc key is pressed.
        escape: false,
      },
      notes: {
        // include notes if any
      },
      theme: {
        color: '#131f37'
      }
    };
    options.handler = ((response, error) => {
      options.response = response;
      // call your backend api to verify payment signature & capture transaction
      var coupon: any = '';
              if (localStorage.hasOwnProperty('coupon')) {
                const couponData = localStorage.getItem('coupon');
                coupon = JSON.parse(couponData).coupon_code;
              }
      const paymentData = {
        payment_id: null,
        amount,
        id,
        coupon,
        emi_grams,
        walletAmount,
        total_installments,
        referralCode,
      };
      if ('razorpay_payment_id' in response) {
        paymentData.payment_id = response.razorpay_payment_id;
      }

      this.api.post(`user/schemes/` + id + `/subscribe`, paymentData)
        .subscribe((r: any) => {
          if ('transactionId' in r) {
            alert('Your transaction successfully added,your transaction id is ' + r.transactionId);
            //window.location.href = `/schemes`;
            sessionStorage.setItem('desc', r.description);
            window.location.href = '/gold/transaction/' + r.transactionId;
          } else {
            alert('Some error Occur,Please Try again');
            window.location.href = `/schemes/` + id + `/subscribe`;
          }
        });
    });
    options.modal.ondismiss = (() => {
      // handle the case when user closes the form while transaction is in progress
      console.log('Transaction cancelled.');
      alert('Transaction cancelled.');
      window.location.href = `/schemes/` + id + `/subscribe`;
    });
    const rzp = new this.winRef.nativeWindow.Razorpay(options);
    rzp.open();
  }

  /**
   * @param amount
   * @param data
   */
  eventCharge(amount: number, data: object): void {
    this.payEventWithRazor(data, amount);
  }

  /**
   *
   * @param orderId
   * @param amount
   */
  payEventWithRazor(data: object, finalAmount: number) {
    console.log(data);
    const amount = data['amount'];
    const eventId = data['eventId'];
    const enteredWalletAmount = data['enteredWalletAmount'];
    // const that = this;
    const options: any = {
      key: environment.razorPayApiKey,
      amount: (finalAmount * 100), // amount should be in paise format to display Rs 1255 without decimal point
      currency: 'INR',
      name: '', // company name or product name
      description: `${environment.app.name} Booking Account Purchase`,  // product description
      image: '/assets/images/favicon.png', // company logo or product image
      order_id: data['orderId'], // order_id created by you in backend
      modal: {
        // We should prevent closing of the form when esc key is pressed.
        escape: false,
      },
      notes: {
        // include notes if any
      },
      theme: {
        color: '#131f37'
      }
    };
    options.handler = ((response, error) => {
      options.response = response;
      // call your backend api to verify payment signature & capture transaction
      const paymentData = {payment_id: null, amount, eventId, enteredWalletAmount};
      if ('razorpay_payment_id' in response) {
        paymentData.payment_id = response.razorpay_payment_id;
      }

      this.api.post(`user/events/gift-gold`, paymentData)
        .subscribe((r: any) => {
          if ('transactionId' in r) {
          // sessionStorage.setItem('desc', 'Your transaction successfully added,your transaction id is ' + r.transactionId);
          sessionStorage.setItem('desc', r.description);
          window.location.href = '/gold/transaction/' + r.transactionId;
          } else {
            alert('Some error Occur,Please Try again');
            window.location.href = `/transactions`;
          }
        });
    });
    options.modal.ondismiss = (() => {
      // handle the case when user closes the form while transaction is in progress
      console.log('Transaction cancelled.');
      alert('Transaction cancelled.');
      window.location.reload();
    });
    const rzp = new this.winRef.nativeWindow.Razorpay(options);
    rzp.open();
  }


  /**
   * @param amount
   * @param data
   */
  schemeChargeMMI(amount: number, data: object): void {
    this.schemeChargeMMIRazor(data, amount);
  }

  /**
   *
   * @param orderId
   * @param amount
   */
  schemeChargeMMIRazor(data, finalAmount: number) {
    const live_price = data['livePrice'];
    const id = data['s_Id'];
    const walletAmount = data['enteredWalletAmount'];
    const referralCode = data['referralCode'];
    // const that = this;
    const options: any = {
      key: environment.razorPayApiKey,
      amount: (finalAmount * 100), // amount should be in paise format to display Rs 1255 without decimal point
      currency: 'INR',
      name: '', // company name or product name
      description: `${environment.app.name} Booking Account Purchase`,  // product description
      image: '/assets/images/favicon.png', // company logo or product image
      order_id: data['orderId'], // order_id created by you in backend
      modal: {
        // We should prevent closing of the form when esc key is pressed.
        escape: false,
      },
      notes: {
        // include notes if any
      },
      theme: {
        color: '#131f37'
      }
    };
    options.handler = ((response, error) => {
      options.response = response;
      // call your backend api to verify payment signature & capture transaction
      const paymentData = {payment_id: null, live_price: null, id, walletAmount, referralCode};
      if ('razorpay_payment_id' in response) {
        paymentData.payment_id = response.razorpay_payment_id;
        paymentData.live_price = live_price;
      }
      this.api.post(`user/schemes/mmi-payment/` + id, paymentData)
        .subscribe((r: any) => {
          if ('transactionId' in r) {
            sessionStorage.setItem('desc', r.description);
            window.location.href = '/gold/transaction/' + r.transactionId;
          } else {
            alert('Some error Occur,Please Try again');
            window.location.href = `/schemes`;
          }
        });
    });
    options.modal.ondismiss = (() => {
      // handle the case when user closes the form while transaction is in progress
      console.log('Transaction cancelled.');
      alert('Transaction cancelled.');
      window.location.href = `/schemes`;
    });
    const rzp = new this.winRef.nativeWindow.Razorpay(options);
    rzp.open();
  }

  // add money in money wallet
  addMoneyWalletRazorpay(amount: number, orderId: string) {
    const options: any = {
      key: environment.razorPayApiKey,
      amount: (amount * 100), // amount should be in paise format to display Rs 1255 without decimal point
      currency: 'INR',
      name: `${environment.app.name}`, // company name or product name
      description: `Add Amount to Booking Account`,  // product description
      image: '/assets/images/favicon.png', // company logo or product image
      order_id: orderId, // order_id created by you in backend
      // contact:'8801182456',
      // email:'sairavan19@gmail.com',
      modal: {
        // We should prevent closing of the form when esc key is pressed.
        escape: false,
      },
      notes: {
        // include notes if any
      },
      theme: {
        color: '#131f37'
      }
    };
    options.handler = ((response, error) => {
      options.response = response;
      // call your backend api to verify payment signature & capture transaction
      const paymentData = {payment_id: null, amount};
      if ('razorpay_payment_id' in response) {
        paymentData.payment_id = response.razorpay_payment_id;
      } else {
        alert('Something went wrong, Please try again');
        window.location.href = '/money-wallet';
      }

      this.api.post(`user/money-wallet/add`, paymentData)
        .subscribe((r: any) => {
            if (r.processed == true) {
              alert(r.message);
              window.location.href = '/money-wallet';
            }
          },
          (err: HttpErrorResponse) => {
            if (err.status == 400) {
              alert('Transaction Failed');
              window.location.href = '/money-wallet';
            }
          });

    });

    options.modal.ondismiss = (() => {
      // handle the case when user closes the form while transaction is in progress
      console.log('Transaction cancelled.');
      // alert('You are Cancelled Transaction.');
      // window.location.href = '/money-wallet';
    });
    const rzp = new this.winRef.nativeWindow.Razorpay(options);
    rzp.open();
  }

  donateMoneyRazorpay(amount: number, finalAmount: number, orderId: string, organizationId: string, enteredWalletAmount: number) {
    const options: any = {
      key: environment.razorPayApiKey,
      amount: (finalAmount * 100), // amount should be in paise format to display Rs 1255 without decimal point
      currency: 'INR',
      name: `${environment.app.name}`, // company name or product name
      description: `Donate gold to organization`,  // product description
      image: '/assets/images/favicon.png', // company logo or product image
      order_id: orderId, // order_id created by you in backend
      modal: {
        // We should prevent closing of the form when esc key is pressed.
        escape: false,
      },
      notes: {
        // include notes if any
      },
      theme: {
        color: '#131f37'
      }
    };
    options.handler = ((response, error) => {
      options.response = response;
      // call your backend api to verify payment signature & capture transaction
      const paymentData = {payment_id: null, amount, organizationId, enteredWalletAmount};
      if ('razorpay_payment_id' in response) {
        paymentData.payment_id = response.razorpay_payment_id;
      } else {
        alert('Something went wrong, Please try again');
        window.location.href = '/user-organizations';
      }

      this.api.post(`organizations/donate-gold`, paymentData)
        .subscribe((r: any) => {
            if (r.processed === true) {
                // alert(r.description);
              sessionStorage.setItem('desc', r.description);
              window.location.href ='/gold/transaction/'+ r.transactionId;
            }
          },
          (err: HttpErrorResponse) => {
            if (err.status === 400) {
              alert('Transaction Failed');
              window.location.href = '/user-organizations';
            }
          });
    });

    options.modal.ondismiss = (() => {
      // handle the case when user closes the form while transaction is in progress
      console.log('Transaction cancelled.');
      alert('You are Cancelled Transaction.');
      window.location.href = '/user-organizations';
    });
    const rzp = new this.winRef.nativeWindow.Razorpay(options);
    rzp.open();
  }

ecomPostingRazorpay(amount:number,live:number,pcount:number,p:number,enteredWalletAmount,size:number,live_price24:number,silver_liveprice:number,stoneid:any){
    const options: any = {
      key: environment.razorPayApiKey,
      amount: (amount*100), // amount should be in paise format to display Rs 1255 without decimal point
      currency: 'INR',
      name: `${environment.app.name}`, // company name or product name
      description: `Buy Product from Ecom`,  // product description
      image: '/assets/images/favicon.png', // company logo or product image
      // order_id: orderId, // order_id created by you in backend
      modal: {
        // We should prevent closing of the form when esc key is pressed.
        escape: false,
      },
      notes: {
        // include notes if any
      },
      theme: {
        color: '#131f37'
      }
    };
    options.handler = ((response, error) => {
      options.response = response;
      let no_of_products =pcount;
         let pid =p;
      let live_price =live;
   
      
      // call your backend api to verify payment signature & capture transaction
      const paymentData = {amount,payment_id: null,no_of_products,pid, enteredWalletAmount,live_price24,size,live_price,silver_liveprice,stoneid};
      if ('razorpay_payment_id' in response) {
        paymentData.payment_id = response.razorpay_payment_id;
      } else { 
        alert('Something went wrong, Please try again');
        window.location.href = '/user-organizations';
      }
     console.log(paymentData)

      this.api.post(`ecom/checkout`,paymentData)
        .subscribe((r: any) => {
                console.log(r)

            if (r.processed === true) {
                // alert(r.description);
                console.log(r)
               let description=r.message
              sessionStorage.setItem('desc', 'Order placed at GoldSikka'+''+description);
              window.location.href ='/ecommerce/paymentsuccess/'+ paymentData.payment_id;

            }
          },
          
          (err: HttpErrorResponse) => {
            console.log(err.status);
            if (err.status === 400) {
              alert('Transaction Failed');
              // window.location.href = '/ecommerce/checkout';
            }
          });
    });

    options.modal.ondismiss = (() => {
      // handle the case when user closes the form while transaction is in progress
      console.log('Transaction cancelled.');
      alert('You are Cancelled Transaction.');
      window.location.href = '/ecommerce/checkout';
    });
    const rzp = new this.winRef.nativeWindow.Razorpay(options);
    rzp.open();
}
}
