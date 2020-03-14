import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastController, LoadingController, AlertController, NavController, MenuController } from '@ionic/angular';
import { AccessProviders } from '../../providers/access-providers';
import { Storage } from '@ionic/storage';

@Component({
  template: `{{ now }}`,
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {

  dataStorage: any;
  name: string;
  public now: any = new Date().toLocaleTimeString();
  greeting: string = "Salam, ";

  constructor(
    private router: Router,
    private toastCtrl: ToastController,
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController,
    private accsPrvds: AccessProviders,
    private storage: Storage,
    public navCtrl: NavController,
    public menuCtrl: MenuController
  ) {
    this.menuCtrl.enable(true);
  }

  ngOnInit() {
  }

  ionViewDidEnter() {
    if (this.now < '4:00:00 AM') {
      this.greeting = 'Malam, ';
    } else if (this.now < '11:00:00 AM') {
      this.greeting = 'Pagi, ';
    } else if (this.now < '4:00:00 PM') {
      this.greeting = 'Siang, ';
    } else if (this.now < '8:00:00 PM') {
      this.greeting = 'Sore, ';
    } else {
      this.greeting = 'Malam, ';
    }
    this.storage.get('storage_xxx').then((res) => {
      console.log(res);
      this.dataStorage = res;
      this.name = this.dataStorage.name;
      this.dataStorage.greeting = this.greeting;
    });
  }

  async processLogout() {
    this.storage.clear();
    this.navCtrl.navigateRoot(['/intro']);
    const toast = await this.toastCtrl.create({
      message: 'Berhasil keluar',
      duration: 1500
    });

    toast.present();
  }

}
