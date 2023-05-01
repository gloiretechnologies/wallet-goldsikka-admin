import {Component, OnInit} from '@angular/core';
import {ApiService} from '../../api.service';
import {PaymentService} from '../../_services/payment.service';
import {Router} from '@angular/router';
import { AuthenticationService } from 'src/app/_services/authentication/authentication.service';

@Component({
    selector: 'app-user-organization-list',
    templateUrl: './user-organization-list.component.html',
    styleUrls: ['./user-organization-list.component.scss']
})
export class UserOrganizationListComponent implements OnInit {

    submitted: boolean;
    errorMessage: string;
    page: number = 1;
    errors: object = {};
    users: any;
    isSubmitting: boolean;


    constructor(
        private api: ApiService,
        private paymentService: PaymentService,
        private router: Router,
    private authService: AuthenticationService,

    ) {
    }

    ngOnInit(): void {
     this.authService.checkAccess();

        this.getResults();
    }

    getResults() {
        this.api.get(`organizations/list?page=${this.page}`)
            .subscribe((response: any) => {
                this.users = response;

            });
    }


    pageChanged(pageNumber) {
        this.page = pageNumber;
        this.getResults();
    }

}
