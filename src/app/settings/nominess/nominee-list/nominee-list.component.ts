import {Component, OnInit} from '@angular/core';
import {ApiService} from '../../../api.service';
import {Router} from '@angular/router';
import {HttpErrorResponse} from '@angular/common/http';
import { AuthenticationService } from 'src/app/_services/authentication/authentication.service';

@Component({
  selector: 'app-nominee-list',
  templateUrl: './nominee-list.component.html',
  styleUrls: ['./nominee-list.component.scss']
})
export class NomineeListComponent implements OnInit {

  nomineeResponse: any = {};
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

    this.getNomineeList();
  }

  getNomineeList(): void {
    this.api.get(`user/nominee`)
      .subscribe((res: any) => {
        this.nomineeResponse = res;
      });
  }

  deleteNominee(id): void {
    if (confirm('Are you sure to delete ? ')) {
      this.api.delete(`user/nominee/${id}`)
        .subscribe((res: any) => {
            this.errorMessage = '';
            this.successMessage = '';
            this.successMessage = 'Nominee Deleted Successfully';
            this.getNomineeList();
          },
          (err: HttpErrorResponse) => {
            this.isSubmitting = false;
          });
    }
  }
}
