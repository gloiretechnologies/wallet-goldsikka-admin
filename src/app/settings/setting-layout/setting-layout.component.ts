import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from 'src/app/_services/authentication/authentication.service';

@Component({
  selector: 'app-setting-layout',
  templateUrl: './setting-layout.component.html',
  styleUrls: ['./setting-layout.component.scss']
})
export class SettingLayoutComponent implements OnInit {

  constructor(
    private authService: AuthenticationService
    
  ) { }

  ngOnInit(): void {
     this.authService.checkAccess();

  }

}
