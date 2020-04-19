import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MenuController, ToastController, LoadingController, AlertController, NavController } from '@ionic/angular';
import { AccessProviders } from '../../providers/access-providers';
import { Storage } from '@ionic/storage';


@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  email: string = "";
  password: string = "";

  disableButton: boolean;

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
    this.menuCtrl.enable(false);
  }

  ngOnInit() {
  }

  ionViewDidEnter() {
    this.disableButton = false;
  }

  async tryLogin() {
    if (this.email == "") {
      this.presentToast('Email harus diisi.')
    } else if (this.password == "") {
      this.presentToast('Password harus diisi.')
    } else {
      this.disableButton = true;
      const loader = await this.loadingCtrl.create({
        message: 'Harap tunggu...',
      });
      loader.present();

      return new Promise(resolve => {
        let body = {
          // action: 'process_login',
          email: this.email,
          password: this.password
        }

        // this.accsPrvds.postData(body, 'process_api.php').subscribe((res: any) => {
        this.accsPrvds.postData(body, 'api/client/login').subscribe((res: any) => {
          if (res.success == true) {
            loader.dismiss();
            this.disableButton = false;
            this.presentToast('Login berhasil');
            this.storage.set('storage_xxx', res.result); // create storage session
            this.navCtrl.navigateRoot(['/home']);
          } else {
            loader.dismiss();
            this.disableButton = false;
            this.presentToast('Email atau password salah');
          }
        }, (err) => {
          loader.dismiss();
          this.disableButton = false;
          // this.presentToast('Timeout');
          this.presentToast('Email atau password salah');
        });
      });
    }
  }

  async presentToast(a: any) {
    const toast = await this.toastCtrl.create({
      message: a,
      duration: 1500
    });

    toast.present();
  }

  openRegister() {
    this.router.navigate(['/register']);
  }

}
