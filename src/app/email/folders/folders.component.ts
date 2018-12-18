import { Component, OnInit, Input, Inject, DoCheck } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subscription } from 'rxjs';
import { AuthorizationService } from '../../authorization.service';

@Component({
  selector: 'app-folders',
  templateUrl: './folders.component.html',
  styleUrls: ['./folders.component.scss']
})
export class FoldersComponent implements OnInit, DoCheck {
  folder_create = false;
  folder_invest = false;
  id_folder = null;
  folder_name = 'Входящие';
  folder_name_for_post;
  all_folders_id = [];
  @Input() user_folders;
  @Input() box_id;
  @Input() ip;

  constructor(
    private http: HttpClient,
    @Inject(AuthorizationService) private authorizationServ: AuthorizationService,
  ) { }

  ngOnInit() {

  }
  ngDoCheck() {
    // console.log(this.folder_name_for_post);
  }
  public httpPost(url: string, body, options?): Observable<any> {
    return this.http.post(url, body, {headers: {Authorization: `Bearer ${this.authorizationServ.accessToken}`}});
  }
  open_folders_settings() {
    this.folder_create = true;
  }
  closeViewer(e) {
    this.folder_create = false;
    this.folder_invest = false;

      this.id_folder = null;
      this.folder_name = 'Входящие';
      this.folder_name_for_post = '';
      this.all_folders_id = [];
  }

  to_invest_open(e) {
    if (e.target.classList.contains('title_inv')) {
      if (this.user_folders === null) {
        this.user_folders = [];
      }
      this.folder_invest = ! this.folder_invest;
    }
  }
  get_folder_id(e) {
    const target = e.target;
    this.id_folder = target.getAttribute('id');
    this.folder_name = target.innerText;
    this.folder_invest = ! this.folder_invest;
    // this.httpPost(`${this.emailServ.ip}/mail/box`, {} , {contentType: 'application/json'}).subscribe((data2) => {
    //   this.emailItems = data2.boxes;
    //   this.user_folders = data2.boxes;
    //   // console.log(this.emailItems)
    //   this.socketServ.lettersSocketConnect();
    // });
  }

  create_folder() {
    //   this.httpPost(`${this.ip}/mail/box`, {
    //     address: this.box_id
    //   } , {contentType: 'application/json'}).subscribe((data2) => {
    // });
    this.deepSearch(this.user_folders);


  }
  deepSearch(arr) {
    for (let i = 0; i < arr.length; i++) {
      if (Array.isArray(arr[i].childs)) {
        this.deepSearch(arr[i].childs);
    }
    this.all_folders_id.push(arr[i].id);
  }

    console.log(this.all_folders_id);

  }

}
