import {Component, OnInit} from '@angular/core';
import {ApiService} from "../../api.service";
import {ActivatedRoute, Router} from "@angular/router";
import { AuthenticationService } from 'src/app/_services/authentication/authentication.service';

@Component({
  selector: 'app-scheme-user-list',
  templateUrl: './scheme-user-list.component.html',
  styleUrls: ['./scheme-user-list.component.scss']
})
export class SchemeUserListComponent implements OnInit {

  schemes: object;
  page: number = 1;
  subscribeSchemeInfo: any = [];
  schemeDataList: boolean;
  schemeTransaction: boolean;

  constructor(
    private api: ApiService,
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthenticationService,

  ) {
  }

  ngOnInit(): void {
     this.authService.checkAccess();

    this.getSchemeIdList(this.route.snapshot.paramMap.get('id'));
  }

  getSchemeIdList(id): void {
    this.api.get(`user/schemes/` + id + `?page=${this.page}`)
      .subscribe((r: any) => {
        this.schemes = r;
      })
  }

  pageChanged(pageNumber) {
    this.page = pageNumber;
    this.getSchemeIdList(this.route.snapshot.paramMap.get('id'));
  }

  addSchemeSubscribe() {
    this.router.navigate(['schemes/' + this.route.snapshot.paramMap.get('id') + '/subscribe']);
  }

  schemeInfo(id) {
    this.router.navigate(['schemes/' + id + '/info']);
  }

  getBackToList() {
    if (confirm('Are You Sure to Exit ?')) {
      this.router.navigate(['schemes']);
    }
  }

}
