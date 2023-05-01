import {Component, OnInit} from '@angular/core';
import {ApiService} from '../../../api.service';
import {HttpErrorResponse} from '@angular/common/http';
import {Router} from '@angular/router';
import { AuthenticationService } from 'src/app/_services/authentication/authentication.service';

@Component({
  selector: 'app-bank-account-list',
  templateUrl: './bank-account-list.component.html',
  styleUrls: ['./bank-account-list.component.scss']
})
export class BankAccountListComponent implements OnInit {
  bankAccountList: any = [];
  successMessage: string;
  errorMessage: string;
  isSubmitting: boolean;
  submitted = false;
  errors: object = {};

  constructor(
    private api: ApiService,
    private router: Router,
    private authService: AuthenticationService

  ) {
  }

  ngOnInit(): void {
     this.authService.checkAccess();

    this.getBanksList();
  }

  getBanksList(): void {
    this.api.get(`user/bankAccount`)
      .subscribe((res: any) => {
        this.bankAccountList = res.data;
      });
  }

  deleteBank(id): void {
    if (confirm('Are you sure to delete ? ')) {
      this.api.delete(`user/bankAccount/` + id)
        .subscribe((res: any) => {
            this.errorMessage = '';
            this.successMessage = '';
            this.getBanksList();
            this.successMessage = 'Bank Account Deleted Successfully';
          },
          (err: HttpErrorResponse) => {
            this.isSubmitting = false;
            this.errors = err.error.errors;
            if (err.error.message.length) {
              this.errorMessage = err.error.message.toString();
            }

            this.isSubmitting = false;
          });
    }
  }

  //Make Primary
  onMakePrimary(id): void {
    this.api.get(`user/bankAccount/${id}/makePrimary`)
      .subscribe((res: any) => {
          this.getBanksList();
        },
        (err: HttpErrorResponse) => {
          this.isSubmitting = false;
        });
  }
}
