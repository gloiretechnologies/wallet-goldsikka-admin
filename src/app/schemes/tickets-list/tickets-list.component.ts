import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {ApiService} from "../../api.service";
import {Router} from "@angular/router";
import {HttpErrorResponse} from "@angular/common/http";
import { AuthenticationService } from 'src/app/_services/authentication/authentication.service';

@Component({
  selector: 'app-tickets-list',
  templateUrl: './tickets-list.component.html',
  styleUrls: ['./tickets-list.component.scss']
})
export class TicketsListComponent implements OnInit {

  schemeList: any = [];
  page: number = 1;
  schemeContent: string;
  ticketList: object = {};
  errors: object = {};
  errorMessage: string;
  submitted = false;
  isSubmitting: boolean;
  showModal: boolean;
  schemeId: any = [];

  form: FormGroup = new FormGroup({
    nick_name: new FormControl('', [Validators.required]),
  });

  constructor(
    private api: ApiService,
    private router: Router,
    private authService: AuthenticationService

  ) {
  }

  show(id) {
    this.schemeId = '';
    this.showModal = true; // Show-Hide Modal Check
    this.schemeId = id;
  }

  //Bootstrap Modal Close event
  hide() {
    this.showModal = false;
  }

  ngOnInit(): void {
     this.authService.checkAccess();

    this.getTicketsList();
    //this.getActiveSchemeList();
  }

  pageChanged(pageNumber) {
    this.page = pageNumber;
    this.getTicketsList();
  }


  getTicketsList(): void {
    this.api.get(`tickets/list/?page=${this.page}`)
      .subscribe((res: any) => {
        this.ticketList = res;
      });
  }


  get f() {
    return this.form.controls;
  }

}
