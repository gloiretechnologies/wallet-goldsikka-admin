import { Component, OnInit } from '@angular/core';
import {ApiService} from '../../api.service';
import {ActivatedRoute, Router} from '@angular/router';
import {NgxPaginationModule} from 'ngx-pagination';
import {RouterModule} from '@angular/router';
import { AuthenticationService } from 'src/app/_services/authentication/authentication.service';

@Component({
  selector: 'app-feed-back-list',
  templateUrl: './feed-back-list.component.html',
  styleUrls: ['./feed-back-list.component.scss']
})
export class FeedBackListComponent implements OnInit {

  testimonials: object;
  page = 1;
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

    this.getTestimonialList();
  }

  getTestimonialList(): void {
    this.api.get(`user/testimonials?page=${this.page}`)
      .subscribe((r: any) => {
        this.testimonials = r;
      });
  }

  pageChanged(pageNumber) {
    this.page = pageNumber;
    this.getTestimonialList();
  }

  delete(id): void {
    this.api.delete(`user/testimonials/` + id)
      .subscribe((r: any) => {
        alert('Your feed back deleted successfully');
        this.getTestimonialList();
      });
  }

}
