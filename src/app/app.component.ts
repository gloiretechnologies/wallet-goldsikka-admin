import {Component} from '@angular/core';
import {fadeAnimation} from './_animations/fadeAnimation';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  animations: [fadeAnimation]
})
export class AppComponent {
  title = 'walletgoldsikkacom';
}
