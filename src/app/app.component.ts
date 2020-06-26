import { Component } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { Storage } from '@ionic/storage';
import { ToastController, NavController } from '@ionic/angular';


@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})

export class AppComponent {

  public selectedIndex = 0;
  version: string = "Beta";
  public appPages = [
    {
      title: 'Beranda',
      url: '/home',
      icon: 'home'
    },
    {
      title: 'Daftar Buku',
      url: '/books',
      icon: 'book'
    },
    {
      title: 'Aktivitas',
      url: '/archive',
      icon: 'receipt'
    },
    {
      title: 'Tentang',
      url: '/about',
      icon: 'information-circle'
    },
  ];

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private storage: Storage,
    private navCtrl: NavController,
    private toastCtrl: ToastController,
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });

    this.storage.get('storage_xxx').then((res) => {
      if (res == null) {
        this.navCtrl.navigateRoot('/intro');
      } else {
        this.navCtrl.navigateRoot('/home');
      }
    });
  }

  ngOnInit() {
    const path = window.location.pathname.split('folder/')[1];
    if (path !== undefined) {
      this.selectedIndex = this.appPages.findIndex(page => page.title.toLowerCase() === path.toLowerCase());
    }
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

  openFacebookProfile() { }

  openInstagramProfile() { }

  openTwitterProfile() { }

  openWebsite() { }

}
