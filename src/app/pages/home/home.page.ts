import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import {
  ToastController,
  LoadingController,
  AlertController,
  NavController,
  MenuController,
  IonInfiniteScroll,
  IonVirtualScroll
} from '@ionic/angular';
import { AccessProviders } from '../../providers/access-providers';
import { Storage } from '@ionic/storage';
import { Md5 } from 'ts-md5';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import * as faker from 'faker';

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
  posts: any;
  dataListLength: any = 0;
  serverUrl: string = "http://localhost:8005/";
  page: any = 0;
  total: any = 0;
  clientId: any = '';
  disableButton: boolean;
  archiveId: any;
  dataList = [];

  @ViewChild(IonInfiniteScroll) infiniteScroll: IonInfiniteScroll;
  @ViewChild(IonVirtualScroll) virtualScroll: IonVirtualScroll;

  // @ViewChild(IonInfiniteScroll) infiniteScroll: IonInfiniteScroll;

  constructor(
    private router: Router,
    private toastCtrl: ToastController,
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController,
    private accsPrvds: AccessProviders,
    private storage: Storage,
    public navCtrl: NavController,
    public menuCtrl: MenuController,
    public http: HttpClient
  ) {
    this.storage.get('client_info').then((res) => {
      this.clientId = res.client_id;
      this.getRecentBooks(this.clientId);
      // console.log(this.clientId);
    });
    // this.getRecentBooks(2);
    this.menuCtrl.enable(true);
  }

  ngOnInit() {
  }

  getRecentBooks(clientId: any) {
    let data: Observable<any>;
    this.page += 1;
    data = this.http.get('http://localhost:8005/api/archive?page=' + this.page + '&clientId=' + clientId);
    data.subscribe(res => {
      this.total = res.total;
      this.dataList = this.dataList.concat(res.data);
      // for (let i = 0; i < res.per_page; i++) {
      //   this.dataList.push({
      //     author: res.data[i].author,
      //     cover: res.data[i].cover,
      //     title: res.data[i].title,
      //   })
      // }
      this.dataListLength = this.dataList.length;
      // console.log(this.dataList[0]);
    })
  }

  loadData(event: any) {

    // Using settimeout to simulate api call 
    setTimeout(() => {

      // load more data
      this.getRecentBooks(this.clientId)

      //Hide Infinite List Loader on Complete
      event.target.complete();

      //Rerender Virtual Scroll List After Adding New Data
      this.virtualScroll.checkEnd();

      // App logic to determine if all data is loaded
      // and disable the infinite scroll
      if (this.dataList.length == this.total) {
        event.target.disabled = true;
      }
    }, 500);
  }

  // loadData(event: any) {
  //   setTimeout(() => {
  //     console.log('Done');
  //     event.target.complete();

  //     // App logic to determine if all data is loaded
  //     // and disable the infinite scroll
  //     let data: Observable<any>;
  //     data = this.http.get('http://localhost:8005/api/book');
  //     data.subscribe(res => {
  //       if (res.length == res.data.length) {
  //         event.target.disabled = true;
  //       }
  //       this.posts = res.data;
  //       this.postsLength = this.posts.length;
  //       // this.posts.cover = "http://localhost:8005/" + res.data.cover;
  //       console.log(this.posts);
  //       console.log('test: ' + this.postsLength);
  //     })
  //     // this.accsPrvds.http.get('localhost:8005/api/book').subscribe((data) => {
  //     //   this.posts = data;
  //     //   console.log(data);
  //     //   if (data.length == 1000) {
  //     //     event.target.disabled = true;
  //     //   }
  //     // });
  //   }, 500);
  // }

  toggleInfiniteScroll() {
    this.infiniteScroll.disabled = !this.infiniteScroll.disabled;
  }

  ionViewDidEnter() {
    console.log(this.now);
    if (this.now < '11:00:00 AM') {
      this.greeting = 'Pagi';
    } else if (this.now > '11:00:00 AM' || this.now < '04:00:00 PM') {
      this.greeting = 'Siang';
    } else if (this.now > '04:00:00 PM' || this.now < '08:00:00 PM') {
      this.greeting = 'Sore';
    } else {
      this.greeting = 'Malam';
    }
    this.storage.get('client_info').then((res) => {
      // console.log(res);
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

  async returnBook(id: any) {
    this.archiveId = id;

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

      this.accsPrvds.putData(body, 'api/archive/update/' + this.archiveId).subscribe((res: any) => {
        if (res.success == true) {
          loader.dismiss();
          this.disableButton = true;
          this.presentToast(res.msg);
          this.router.navigate(['/home']);
          this.dataList.forEach(element => {
            if (element.id == this.archiveId) {
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
            this.returnBook(this.archiveId);
          }
        }
      ]
    });

    await alert.present();
  }

}
