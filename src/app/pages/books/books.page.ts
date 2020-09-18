import { Component, OnInit, ViewEncapsulation, TemplateRef, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AccessProviders } from '../../providers/access-providers';
import { ToastController, LoadingController, AlertController } from '@ionic/angular';
import { Router, ActivatedRoute } from '@angular/router';
import { Storage } from '@ionic/storage';

export interface Data {
  movies: string;
}

@Component({
  selector: 'app-books',
  templateUrl: './books.page.html',
  styleUrls: ['./books.page.scss'],
  encapsulation: ViewEncapsulation.None
})
export class BooksPage implements OnInit {

  public data: Data;
  public columns: any;
  public rows: any;
  public bookId: any;
  disableButton: boolean;
  dataList = [];
  clientId: any = '';

  @ViewChild('editTmpl', { static: true }) editTmpl: TemplateRef<any>;
  @ViewChild('editTmpl2', { static: true }) editTmpl2: TemplateRef<any>;

  constructor(
    private router: Router,
    private http: HttpClient,
    private accsPrvds: AccessProviders,
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController,
    private toastCtrl: ToastController,
    private storage: Storage,
  ) {
    // this.http.get<Data>('../../assets/movies.json')
    this.storage.get('client_info').then((res: any) => {
      this.clientId = res.client_id;
    });
    this.accsPrvds.get('api/book')
      .subscribe((res: any) => {
        this.rows = res.data;
      });
  }

  ngOnInit() {
    this.columns = [
      { cellTemplate: this.editTmpl, name: 'Cover' },
      { name: 'Title' },
      { name: 'Author' },
      { name: 'Quantity' },
      { cellTemplate: this.editTmpl2, name: 'Action' }
    ];
  }

  async borrowBook(id: any) {
    this.bookId = id;

    this.disableButton = true;
    const loader = await this.loadingCtrl.create({
      message: 'Harap tunggu...',
    });
    loader.present();

    return new Promise(resolve => {
      let body: any;
      body = {
        event: 0,
      }

      this.accsPrvds.postData(body, 'api/archive/borrow-book/' + this.clientId + '/' + this.bookId).subscribe((res: any) => {
        if (res.success == true) {
          loader.dismiss();
          this.disableButton = true;
          this.presentToast(res.msg);
          this.router.navigate(['/home']);
          this.dataList.forEach(element => {
            if (element.id == this.bookId) {
              element.event = 0;
            }
          });
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
            // console.log('Confirm Cancel: blah');
          }
        }, {
          text: 'Try Again',
          handler: () => {
            this.borrowBook(this.bookId);
          }
        }
      ]
    });

    await alert.present();
  }
}
