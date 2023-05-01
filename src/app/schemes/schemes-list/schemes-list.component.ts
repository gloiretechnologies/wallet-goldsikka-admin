import {Component, OnInit} from '@angular/core';
import {ApiService} from '../../api.service';
import {Router} from '@angular/router';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {HttpErrorResponse} from "@angular/common/http";
import { AuthenticationService } from 'src/app/_services/authentication/authentication.service';

@Component({
  selector: 'app-schemes-list',
  templateUrl: './schemes-list.component.html',
  styleUrls: ['./schemes-list.component.scss']
})
export class SchemesListComponent implements OnInit {

  schemeList: any = [];
  page: number = 1;
  schemeContent: string;
  activeSchemesList: object = {};
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
    private authService: AuthenticationService,

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

    this.getSchemeList();
    this.getActiveSchemeList();
  }

  pageChanged(pageNumber) {
    this.page = pageNumber;
    this.getActiveSchemeList();
  }

  getSchemeList() {
    this.api.get(`schemes`)
      .subscribe((res: any) => {
        this.schemeList = res;
      });
  }

  getActiveSchemeList(): void {
    this.api.get(`user/schemes?page=${this.page}`)
      .subscribe((res: any) => {
        this.activeSchemesList = res;
      });
  }


  // getSchemeContent(id) {
  //   this.api.get(`user/schemes/` + id + `/content`)
  //     .subscribe((res: any) => {
  //       this.schemeContent = res;
  //     });
  // }


  onSubmit() {
    this.errorMessage = '';
    this.submitted = true;
    if (this.form.invalid) {
      return;
    }
    this.errors = [];
    this.errorMessage = '';
    this.isSubmitting = true;
    this.api.post(`user/schemes/` + this.schemeId + `/scheme-nickname`, this.form.value)
      .subscribe((r: any) => {
          this.isSubmitting = false;
          window.location.href = `/schemes`;
        },
        (err: HttpErrorResponse) => {
          this.isSubmitting = false;
          this.errorMessage = '';
          this.errors = {};
          if (err.error.errors) {
            this.errors = err.error.errors;
          }
          if (err.error.message && err.error.message.length) {
            this.errorMessage = err.error.message.toString();
          }
          this.isSubmitting = false;
        });
  }

  nickNameScreen(id) {
    this.show(id);
  }

  get f() {
    return this.form.controls;
  }
}
