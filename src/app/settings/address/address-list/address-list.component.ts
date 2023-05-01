import {Component, OnInit} from '@angular/core';
import {ApiService} from '../../../api.service';
import {HttpErrorResponse} from "@angular/common/http";
import {Router} from "@angular/router";
import { AuthenticationService } from 'src/app/_services/authentication/authentication.service';

@Component({
  selector: 'app-address-list',
  templateUrl: './address-list.component.html',
  styleUrls: ['./address-list.component.scss']
})
export class AddressListComponent implements OnInit {
  addressResponse: any = {};
  successMessage: string;
  errorMessage: string;
  isSubmitting: boolean;
  submitted = false;

  constructor(
    private api: ApiService,
    private router: Router,
    private authService: AuthenticationService

  ) {
  }

  ngOnInit(): void {
     this.authService.checkAccess();

    this.getAddressList();
  }

  getAddressList(): void {
    this.api.get(`user/address`)
      .subscribe((res: any) => {
        this.addressResponse = res;
      });
  }

  deleteAddress(id): void {
    if (confirm('Are you sure to delete ? ')) {
      this.api.delete(`user/address/${id}`)
        .subscribe((res: any) => {
            this.errorMessage = '';
            this.successMessage = '';
            this.successMessage = 'Address Deleted Successfully';
            this.getAddressList();
          },
          (err: HttpErrorResponse) => {
            this.isSubmitting = false;
          });
    }
  }

  onMakePrimary(id): void {
    this.api.get(`user/address/${id}/makePrimary`)
      .subscribe((res: any) => {
          this.getAddressList();
        },
        (err: HttpErrorResponse) => {
          this.isSubmitting = false;
        });
  }
}
