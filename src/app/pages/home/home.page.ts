import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastController, LoadingController, AlertController, NavController, MenuController } from '@ionic/angular';
import { AccessProviders } from '../../providers/access-providers';
import { Storage } from '@ionic/storage';
import { Md5 } from 'ts-md5';

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
  greeting: string = "Bersemangat";
  profilePicture: any = "";

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
    if (this.now < '11:00:00 AM') {
      this.greeting = 'Pagi ';
    } else if (this.now < '4:00:00 PM') {
      this.greeting = 'Siang ';
    } else if (this.now < '8:00:00 PM') {
      this.greeting = 'Sore ';
    } else {
      this.greeting = 'Malam ';
    }
    this.storage.get('storage_xxx').then((res) => {
      console.log(res);
      this.dataStorage = res;
      this.profilePicture = "https://www.gravatar.com/avatar/" + Md5.hashStr(this.dataStorage.email);
      this.name = this.dataStorage.first_name + ' ' + this.dataStorage.last_name;
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
