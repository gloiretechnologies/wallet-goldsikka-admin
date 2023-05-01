import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../api.service';
import { AuthenticationService } from '../../_services/authentication/authentication.service';
import { GoldService } from '../../gold/gold.service';
import { AccountService } from '../account.service';
import { saveAs } from 'file-saver';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  HEAD;
  balance: object;
  transactions: any;
  referrals: object;
  firstName: string;
  goldInfo: number;
  goldPriceCssClass: string;
  roleId: number;
  walletAmount: number;
  orgType: number;

  constructor(
    private api: ApiService,
    private authenticationService: AuthenticationService,
    private goldService: GoldService,
    private accountService: AccountService
  ) //  private websocketService: WebsocketService,
  {}

  ngOnInit(): void {
  
    this.getBalance();
    this.getRecentTransactions();
    this.getCurrentGoldPrice();
    this.getReferralCode();
    this.getWalletAmount();
    const user = this.authenticationService.getUser();
     this.authenticationService.checkAccess();
    this.firstName = user.name;
    if (localStorage.hasOwnProperty('isSocialLogin')) {
      this.roleId = 1;
    } else {
      this.roleId = user.roleId;
    }
    this.orgType = user.orgType;


    // Once the price is fetched, attach WebSocket
    /* this.websocketService.subscribe('gold/24/price', data => {
           this.goldPriceCssClass = 'blink'
           this.goldInfo['buy_price_per_gram'] = data['buy'];
           this.goldInfo['sell_price_per_gram'] = data['sell'];

           const that = this
           setTimeout(function() {
             that.goldPriceCssClass = ''
           }, 5000);
         });*/

  }

  getBalance(): void {
    this.accountService.getBalance().subscribe((r: object) => {
      const balance = r['balance'];
      const grams = new Number(balance.inGrams);
      balance.inGrams = grams.toFixed(3);
      this.balance = balance;
    });
  }

  getRecentTransactions(): void {
    this.api.get(`user/transactions?per_page=5`).subscribe((r: object) => {
      this.transactions = r;
    });
  }

  getCurrentGoldPrice(): void {
    this.goldService.getCurrentGoldPrice().subscribe((r: any) => {
      this.goldInfo = r;
     
    });
  }

  getReferralCode(): void {
    this.api.get(`user/referral/earnings`).subscribe((r: object) => {
      this.referrals = r;
    });
  }

  downloadReceipt(id) {
    this.api
      .get(`user/one-transaction-pdf/` + id, { responseType: 'blob' })
      .subscribe((r: any) => {
        saveAs(
          new Blob([r], { type: 'application/pdf' }),
          'Transaction-slip.pdf'
        );
      });
  }

  //Money wallet AMount

  getWalletAmount(): void {
    this.api.get(`user/money-wallet/amount`).subscribe(
      (r: any) => {
        this.walletAmount = r.amount;
      },
      (err: HttpErrorResponse) => {
        if (err.status === 400) {
          alert('Server error. Please try again later');
        }
      }
    );
  }

  
}
