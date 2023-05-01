import {Component, OnInit} from '@angular/core';
import {ApiService} from '../../api.service';
import {HttpErrorResponse} from '@angular/common/http';
import {saveAs} from 'file-saver';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {AuthenticationService} from '../../_services/authentication/authentication.service';

@Component({
    selector: 'app-passbook',
    templateUrl: './passbook.component.html',
    styleUrls: ['./passbook.component.scss']
})
export class PassbookComponent implements OnInit {

    transactions: object;
    page = 1;
    submitted: boolean;
    type: boolean;
    roleId: number;
    form: FormGroup = new FormGroup({
        type: new FormControl('', [Validators.required]),
    });

    constructor(
        private api: ApiService,
        private authenticationService: AuthenticationService,
    ) {
    }

    ngOnInit(): void {
     this.authenticationService.checkAccess();

        const user = this.authenticationService.getUser();
        this.roleId = user.roleId;

        this.getTransactions();
    }

    getTransactions(): void {
        const type = this.form.get('type').value;
        this.api.get(`user/transactions?page=${this.page}&&txn_type=${type}`)
            .subscribe((r: any) => {
                this.transactions = r;
            });
    }

    pageChanged(pageNumber) {
        this.page = pageNumber;
        this.getTransactions();
    }

    downloadReceipt(id) {
        this.api.get(`user/one-transaction-pdf/` + id, {responseType: 'blob'})
            .subscribe((r: any) => {
                saveAs(new Blob([r], {type: 'application/pdf'}), 'Transaction-slip.pdf');
            });
    }

    getTypeValue(value) {
        console.log(value);
    }

    getTypeBasedTransaction() {
        const type = this.form.get('type').value;
        this.api.get(`user/transactions?page=${this.page}&&txn_type=${type}`)
            .subscribe((r: any) => {
                this.transactions = r;
            });
    }
}
