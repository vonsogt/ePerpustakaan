import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastController, LoadingController, AlertController } from '@ionic/angular';
import { AccessProviders } from '../../providers/access-providers';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {

  first_name: string = "";
  last_name: string = "";
  identity: string = "";
  email: string = "";
  phone: string = "";
  password: string = "";
  c_password: string = "";

  disableButton: boolean;

  constructor(
    private router: Router,
    private toastCtrl: ToastController,
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController,
    private accsPrvds: AccessProviders
  ) { }

  ngOnInit() {
  }

  ionViewDidEnter() {
    this.disableButton = false;
  }

  async tryRegister() {
    if (this.first_name == "") {
      this.presentToast('Nama depan harus diisi.')
    } else if (this.last_name == "") {
      this.presentToast('Nama belakang harus diisi.')
    } else if (this.identity == "") {
      this.presentToast('Identitas harus diisi.')
    } else if (this.email == "") {
      this.presentToast('Email harus diisi.')
    } else if (this.phone == "") {
      this.presentToast('Nomor hp harus diisi.')
    } else if (this.password == "") {
      this.presentToast('Password harus diisi.')
    } else if (this.c_password != this.password) {
      this.presentToast('Password tidak sama.')
    } else {
      this.disableButton = true;
      const loader = await this.loadingCtrl.create({
        message: 'Harap tunggu...',
      });
      loader.present();

      return new Promise(resolve => {
        let body = {
          first_name: this.first_name,
          last_name: this.last_name,
          identity: this.identity,
          email: this.email,
          phone: this.phone,
          password: this.password,
          c_password: this.c_password
        }

        this.accsPrvds.postData(body, 'api/client/register').subscribe((res: any) => {
          if (res.success == true) {
            loader.dismiss();
            this.disableButton = false;
            this.presentToast(res.msg);
            this.router.navigate(['/login']);
          } else {
            loader.dismiss();
            this.disableButton = false;
            this.presentToast(res.msg);
          }
        }, (err) => {
          loader.dismiss();
          this.disableButton = false;
          this.presentAlert('Timeout');
        });
      });
    }
  }

  async presentToast(a: any) {
    const toast = await this.toastCtrl.create({
      message: a,
      duration: 1500,
      position: 'top'
    });

    toast.present();
  }

  async presentAlert(a: any) {
    const alert = await this.alertCtrl.create({
      header: a,
      backdropDismiss: false,
      buttons: [
        {
          text: 'Close',
          handler: (blah) => {
            console.log('Confirm Cancel: blah');
            // action
          }
        }, {
          text: 'Try Again',
          handler: () => {
            this.tryRegister();
          }
        }
      ]
    });

    await alert.present();
  }

}
