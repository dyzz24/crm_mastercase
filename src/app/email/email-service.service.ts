import { Injectable} from '@angular/core';

import { HttpClientModule } from '@angular/common/http';
import { HttpClient } from '@angular/common/http';
import { Router} from '@angular/router';
import { Observable } from 'rxjs';
import { AuthorizationService } from '../authorization.service';


@Injectable({
  providedIn: 'root'
})
export class EmailServiceService {
  emails;


  idBox: string; // стринга для подставления в адр. строку браузера - имя ящика
  typeMess: string;
  activeLett: Array<boolean> = [];
  hideAvatars: Array<boolean> = [];
  senderName: string;
  time: string;
  avatar: any;
  caption: string;
  text: string;
  selectedMess = 1;
  urlParams: string;
  messageState: any;
  activeEl: Array<boolean> = [];
  fullPath: any;
  idLetters = [];
  hiddenTrash = true;
  hiddenEmpty = false;
  lettersList: any;
  allLettersId = [];
  currentId: any;
  copy: any;

  notLettersFlag; // флаг, что писем нет
  haveResponse;

  index;
  result;
  currentObjectLetter;
  currentInd;
  inworkLetter;
  haveattachLetter;
  importantLetter;

  visibleLetters: any;
  lettersAmount = 25; // количество подгружаемых писем - const
  selectNum; // Папка писем, где 0- входящие 1 - исходящие и ТД.
  idPostForHTTP; // ID ящика
  adress; // адрес для URL запросов на сервак
  noMessages = false; // DEL
  offset;


  stopFlag = false; // для остановки отправки http пока не выполнится предыдущий http
  dataLetters; // для остановки подгруза писем когда все загружены

  selectedLetter: any;
  ip = 'http://10.0.1.33:3000';

  mailsToArray = []; // кому отправить письмо (список адресатов)
  subjectTo;

  cut_cc_adressess_array;
  cut_addressess_array;



  constructor(private http: HttpClient, private rout: Router, private authorizationServ: AuthorizationService) {

      // this.rout.navigate(['']);
      if (this.authorizationServ.accessToken === undefined) {
        this.rout.navigate(['']);
      } else {
        this.rout.navigate(['/email']);
      }


  }


public httpPost(url: string, body, options?): Observable<any> {
  return this.http.post(url, body, {headers: {Authorization: `Bearer ${this.authorizationServ.accessToken}`}});
}


  checkerTrash() {
    if (this.idLetters.length > 0) {
      this.hiddenTrash = false;
    } else {
      this.hiddenTrash = true;
    }
  }

  deleteChangesComponents() {
    this.activeLett = [];
    this.hideAvatars = [];
  }

  visibleLett(param) {
    if (this.noMessages === true) {
      // DEL
      return;
    }
    const visibleLetters = this.lettersList.map((val, ind, arr) => {
      if (ind < param) {
        return val;
      }
    });
    const filtered = visibleLetters.filter(a => a !== undefined);
    this.visibleLetters = filtered;
  }

  avatarMake(item) {
    item.toString();
    const firstLett = item[0];
    return firstLett;
  }

  newMessage() {
    this.rout.navigate([this.urlParams + '/create']);
    this.fullPath = this.urlParams + '/create';
    this.hiddenEmpty = true;
  }


  checkerLengthArray_bcc_cc() {
    if (this.selectedLetter.cc_addresses === null) {
      return;
    }
    if (this.selectedLetter.cc_addresses.length > 3) {
      this.selectedLetter.cc_addresses = [];
      this.cut_cc_adressess_array = this.selectedLetter.cc_addresses.slice(0, 3);
    }
  }
  checkerLength_addressess() {

    if (this.selectedLetter.to_addresses.length > 3) {
      this.cut_addressess_array = [];
      this.cut_addressess_array = this.selectedLetter.to_addresses.slice(0, 3);
    }
  }
}
