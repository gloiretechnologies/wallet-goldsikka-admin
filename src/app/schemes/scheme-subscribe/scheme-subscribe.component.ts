import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {ApiService} from '../../api.service';
import { AuthenticationService } from 'src/app/_services/authentication/authentication.service';
@Component({
  selector: 'app-scheme-subscribe',
  templateUrl: './scheme-subscribe.component.html',
  styleUrls: ['./scheme-subscribe.component.scss']
})
export class SchemeSubscribeComponent implements OnInit {

  schemeContent: any = [];
  features: any = [];
  faqs: any = [];

  constructor(
    private api: ApiService,
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthenticationService,

  ) {
  }

  ngOnInit(): void {
     this.authService.checkAccess();

    this.getSchemeContent(this.route.snapshot.paramMap.get('id'));
  }


  getSchemeContent(id): void {
    this.api.get(`user/schemes/${id}/content`)
      .subscribe((r: any) => {
        this.schemeContent = r;
        if(this.schemeContent.scheme_features) {
          this.features = this.schemeContent.scheme_features.length;
        }
        if(this.schemeContent.scheme_faqs) {
          this.faqs = this.schemeContent.scheme_faqs.length;
        }
      });
  }

  ngAfterViewInit() {
    var acc = document.getElementsByClassName("accordion");
    var i;

    for (i = 0; i < acc.length; i++) {
      acc[i].addEventListener('click', function () {
        this.classList.toggle('active');
        const panel = this.nextElementSibling;
        if (panel.style.maxHeight) {
          panel.style.maxHeight = null;
        } else {
          panel.style.maxHeight = panel.scrollHeight + "px";
        }
      });
    }
  }
}
