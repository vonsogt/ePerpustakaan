import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { MenuController } from '@ionic/angular';


@Component({
  selector: 'app-intro',
  templateUrl: './intro.page.html',
  styleUrls: ['./intro.page.scss'],
})
export class IntroPage implements OnInit {

  constructor(
    private router: Router,
    public menuCtrl: MenuController
  ) {
    this.menuCtrl.enable(false);
  }

  ngOnInit() {
  }

  openLogin() {
    this.router.navigate(['/login']);
  }

}
