import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastController, LoadingController, AlertController } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { AccessProviders } from '../../../providers/access-providers';

@Component({
  selector: 'app-update',
  templateUrl: './update.page.html',
  styleUrls: ['./update.page.scss'],
})
export class UpdatePage implements OnInit {

  client_id: string = null;
  first_name: string = "";
  last_name: string = "";
  identity: string = "";
  email: string = "";
  phone: string = "";
  old_password: string = "";
  new_password: string = "";

  disableButton: boolean;
  showOldPassword: boolean = false;
  showNewPassword: boolean = false;
  oldPasswordToggleIcon = "eye";
  newPasswordToggleIcon = "eye";
  dataStorage: any;

  constructor(
    private router: Router,
    private toastCtrl: ToastController,
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController,
    private accsPrvds: AccessProviders,
    private storage: Storage,
  ) { }

  ngOnInit() {
  }

  togglePassword(field: string) {
    if (field == 'new') {
      this.showNewPassword = !this.showNewPassword;
      if (this.newPasswordToggleIcon == "eye")
        this.newPasswordToggleIcon = "eye-off";
      else
        this.newPasswordToggleIcon = "eye";
    } else {
      this.showOldPassword = !this.showOldPassword;
      if (this.oldPasswordToggleIcon == "eye")
        this.oldPasswordToggleIcon = "eye-off";
      else
        this.oldPasswordToggleIcon = "eye";
    }
  }

  ionViewDidEnter() {
    this.storage.get('client_info').then((res) => {
      this.dataStorage = res;
      this.client_id = this.dataStorage.client_id;
      this.first_name = this.dataStorage.first_name;
      this.last_name = this.dataStorage.last_name;
      this.identity = this.dataStorage.identity;
      this.email = this.dataStorage.email;
      this.phone = this.dataStorage.phone;

      // this.name = this.dataStorage.first_name + ' ' + this.dataStorage.last_name;
      // this.dataStorage.greeting = this.greeting;
    });
  }

  async updateProfile() {
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
    } else if (this.old_password != "" && this.new_password == "") {
      this.presentToast('Kolom kata sandi baru harus diisi.')
    } else if (this.new_password != "" && this.old_password == "") {
      this.presentToast('Kolom kata sandi lama harus diisi.')
    } else {
      this.disableButton = true;
      const loader = await this.loadingCtrl.create({
        message: 'Harap tunggu...',
      });
      loader.present();

      // this.storage.get('client_info').then((res) => {
      //   let value = JSON.parse(JSON.stringify(res));

      //   // Modify just that property
      //   value.first_name = 'test';

      //   // var newData = JSON.parse(res);
      //   console.log(value);

      //   // Save the entire data again
      //   this.storage.set('client_info', value);
      // });

      return new Promise(resolve => {
        let body: any;
        if (this.old_password == "") {
          body = {
            first_name: this.first_name,
            last_name: this.last_name,
            identity: this.identity,
            email: this.email,
            phone: this.phone,
          }
        } else {
          body = {
            first_name: this.first_name,
            last_name: this.last_name,
            identity: this.identity,
            email: this.email,
            phone: this.phone,
            password: this.old_password,
            new_password: this.new_password
          }
        }

        this.storage.get('client_info').then((res) => {
          let value = JSON.parse(JSON.stringify(res));
  
          // Modify just that property
          value = body;
          value.client_id = this.client_id;
  
          // Save the entire data again
          this.storage.set('client_info', value);
        });

        this.accsPrvds.putData(body, 'api/client/update/' + this.client_id).subscribe((res: any) => {
          if (res.success == true) {
            loader.dismiss();
            this.disableButton = false;
            this.presentToast(res.msg);
            this.router.navigate(['/home']);
          } else {
            loader.dismiss();
            this.disableButton = false;
            this.presentToast(Object.values(res.msg)[0]);
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
      position: 'bottom'
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
            // console.log('Confirm Cancel: blah');
          }
        }, {
          text: 'Try Again',
          handler: () => {
            this.updateProfile();
          }
        }
      ]
    });

    await alert.present();
  }

}
