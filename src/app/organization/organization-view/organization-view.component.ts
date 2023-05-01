import {Component, OnInit} from '@angular/core';
import {ApiService} from '../../api.service';
import { AuthenticationService } from 'src/app/_services/authentication/authentication.service';

@Component({
    selector: 'app-organization-view',
    templateUrl: './organization-view.component.html',
    styleUrls: ['./organization-view.component.scss']
})
export class OrganizationViewComponent implements OnInit {

    response: any;
    isClicked: boolean;

    constructor(
        private api: ApiService,
    private authService: AuthenticationService,

    ) {
    }


    ngOnInit(): void {
     this.authService.checkAccess();

        this.getInfo();
    }

    getInfo() {
        this.api.get(`organizations/view`)
            .subscribe((r: any) => {
                this.response = r;
            });
    }
}
