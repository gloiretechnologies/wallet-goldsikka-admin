import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../api.service';
import {ActivatedRoute, Router} from '@angular/router';
import { log } from 'console';




@Component({
  selector: 'app-jewellery-inventory',
  templateUrl: './jewellery-inventory.component.html',
  styleUrls: ['./jewellery-inventory.component.scss']
})
export class JewelleryInventoryComponent implements OnInit {

  categoryid:any;
  categorycall: any=[];
  catname:any;
  r:any;
  catid:any;
  page: number = 1;
  list: any;
  count:any;
  main:any;
  notificationsCount: number;
 wishlistCount: number;
  response: any;
  isClicked: boolean;
  notificationsModal: boolean;
  wishlistid:any;
  constructor(
    private api: ApiService,
    private route: ActivatedRoute,
    private router: Router
  ) { }
  ngOnInit(): void {
    this.getwishlistcount();
    this.getInfo();
  }
getNotifications() {
  }
    pageChanged(pageNumber: number) {
    this.page = pageNumber;
    this.getNotifications();
  }
  setlocal(catname,catid){
  console.log(catname,catid);
  localStorage.setItem('catname',catname); 
  this.router.navigate([`/jewelleryinventory/productbycats/${catid}`]);
  }

  getInfo() {
    this.api.get(`Jewellery/categories`)
      .subscribe((r: any) => {
        this.response = r;
        console.log(r);
      });
  }

  getwishlistcount() {
    this.api.get(`Jewellery/wishlist`)
    .subscribe((count:any) => {
      this.main = count;
      
      this.wishlistCount=this.main.length;
      console.log("hhhhhhhhhhhhhh",this.wishlistCount);
       
    
     });
  }
}
