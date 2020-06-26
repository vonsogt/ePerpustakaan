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
@Component({
  selector: 'app-archive',
  templateUrl: './archive.page.html',
  styleUrls: ['./archive.page.scss'],
})
export class ArchivePage implements OnInit {

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
  buttonColor: string = 'primary'; //Default Color
  returnButtonText: string = 'KEMBALIKAN';
  dataList = [];

  @ViewChild(IonInfiniteScroll) infiniteScroll: IonInfiniteScroll;
  @ViewChild(IonVirtualScroll) virtualScroll: IonVirtualScroll;

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
    data = this.http.get('http://localhost:8005/api/archive?page=' + this.page + '&clientId=' + clientId + '&event=2');
    data.subscribe(res => {
      this.total = res.total;
      this.dataList = this.dataList.concat(res.data);
      this.dataListLength = this.dataList.length;
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
}
