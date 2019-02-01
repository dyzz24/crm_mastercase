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
  closeViewer() {
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
    const target = e.target.closest('.wrapper');
    this.id_folder = target.getAttribute('id');
    console.log(this.id_folder);
    this.folder_name = target.querySelector('.folders_name').innerHTML;
    this.folder_invest = ! this.folder_invest;
    this.randomizer(this.user_folders);
    this.random_nums_id(this.all_folders_id);
    // this.httpPost(`${this.emailServ.ip}/mail/box`, {} , {contentType: 'application/json'}).subscribe((data2) => {
    //   this.emailItems = data2.boxes;
    //   this.user_folders = data2.boxes;
    //   // console.log(this.emailItems)
    //   this.socketServ.lettersSocketConnect();
    // });
  }

  create_folder() {

      this.randomizer(this.user_folders); // собираю все айдишники в массив
      console.log(this.user_folders);
      this.deepSearch(this.user_folders, this.id_folder); // главная функция
      this.closeViewer(); // закрыть
      const obj_for_resp = [{id: 1, childs: this.user_folders}];
      this.httpPost(`${this.ip}/mail/box/update`, {
        address: this.box_id, boxes: obj_for_resp
      } , {contentType: 'application/json'}).subscribe((data2) => {
    });


  }
  deepSearch(arr, id_folders_select) {

    if (id_folders_select === null) { // если вложенная папка не выбрана
      arr.push({title: this.folder_name_for_post, id: this.random_nums_id(this.all_folders_id)}); // пушу в корень объект
      return false; // выхожу из ф-ии
    }

    for (let i = 0; i < arr.length; i++) {
      if (Array.isArray(arr[i].childs)) { // пробегаюсь по всем массивам - чилдам
        this.deepSearch(arr[i].childs, id_folders_select);
    }


    if (arr[i].id === +id_folders_select) { // ищу вложенный чилд


        if (arr[i].childs !== undefined) { // если ключ childs есть -
          arr[i].childs.push({title: this.folder_name_for_post, id: this.random_nums_id(this.all_folders_id)});
          // пушу в него объект с именем и ID
        } else {
          arr[i].childs = [{title: this.folder_name_for_post, id: this.random_nums_id(this.all_folders_id)}]; // иначе создаю ребенка
        }

    }
  }


  }

  randomizer(arr?) {

    for (let i = 0; i < arr.length; i++) {
      if (Array.isArray(arr[i].childs)) {
        this.randomizer(arr[i].childs);
    }
    this.all_folders_id.push(arr[i].id); // собираю все ID-шки которые есть
  }


    // const number = Math.floor(Math.random() * (1000 - 100 + 1)) + 5;
    // return number;
  }

  random_nums_id(arr) {
    let number = Math.floor(Math.random() * (1000 - 100 + 1)) + 5; // создаю рандом
      for (let i = 0; i < arr.length; i++) {
        if (arr[i] === number) { // если рандом есть в объекте -
          number = Math.floor(Math.random() * (1000 - 100 + 1)) + 5; // новый рандом
            i = 0; // обнуляю счетчик
        }

      }
      return number; // если нет возвращаю число
  }

  move_letter() {
      console.log('run');
  }

}

