import { Injectable} from '@angular/core';

import { HttpClientModule } from '@angular/common/http';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class EmailServiceService {
  emails;

  idBox: string;
  typeMess: string;
  activeLett: Array<boolean> = [];
  hideAvatars: Array<boolean> = [];
  mailName: string;
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

  index;
  result;
  currentObjectLetter;
  currentInd;
  inworkLetter;
  haveattachLetter;
  importantLetter;

  visibleLetters: any;
  lettersAmount = 15; // количество подгружаемых писем - const
  selectNum; // Папка писем, где 0- входящие 1 - исходящие и ТД.
  idPostForHTTP; // ID ящика
  adress; // адрес для URL запросов на сервак
  noMessages = false; // DEL
  offset;
  accessToken; // autorization

  stopFlag = false; // для остановки отправки http пока не выполнится предыдущий http
  dataLetters; // для остановки подгруза писем когда все загружены

  selectedLetter: any;

  constructor(private http: HttpClient) {
    if (localStorage.getItem('all-states') === null) {
      return;
    } else {
      const state = JSON.parse(localStorage.getItem('all-states'));
      this.idBox = state.idBox;
      this.typeMess = state.typeMess;
      this.activeLett = state.activeLett;
      // this.mailName = state.mailName;
      // this.senderName = state.senderName;
      // this.time = state.time;
      // this.avatar = state.avatar;
      // this.caption = state.caption;
      // this.text = state.text;
      this.selectedMess = state.selectedMess;
      this.urlParams = state.urlParams;
      this.messageState = state.messageState;
      this.activeEl = state.activeEl;
      this.fullPath = state.fullPath;
      this.hiddenEmpty = state.hiddenEmpty;
      this.lettersList = state.lettersList;

      this.index = state.index;
      this.result = state.result;
      this.currentObjectLetter = state.currentObjectLetter;
      this.currentInd = state.currentInd;

      this.copy = state.copy;

      this.inworkLetter = state.inworkLetter;
      this.haveattachLetter = state.haveattachLetter;
      this.importantLetter = state.importantLetter;
      this.visibleLetters = state.visibleLetters;
      this.noMessages = state.noMessages;
      this.selectedLetter = state.selectedLetter;
      this.accessToken = state.accessToken;
      this.selectNum = state.selectNum;
      this.idPostForHTTP = state.idPostForHTTP;
      this.adress = state.adress;

    }
  }

  stateServ() {
    const objState = {
      idBox: this.idBox,
      typeMess: this.typeMess,
      activeLett: this.activeLett,
      selectedMess: this.selectedMess,
      urlParams: this.urlParams,
      messageState: this.messageState,
      activeEl: this.activeEl,
      fullPath: this.fullPath,
      hiddenEmpty: this.hiddenEmpty,
      lettersList: this.lettersList.slice(0, this.lettersAmount),
      index: this.index,
      result: this.result,
      currentObjectLetter: this.currentObjectLetter,
      currentInd: this.currentInd,
      copy: this.copy,
      inworkLetter: this.inworkLetter,
      haveattachLetter: this.haveattachLetter,
      importantLetter: this.importantLetter,
      visibleLetters: this.visibleLetters,
      noMessages: this.noMessages,
      selectedLetter: this.selectedLetter,
      accessToken: this.accessToken,
      selectNum: this.selectNum,
      idPostForHTTP: this.idPostForHTTP,
      adress: this.adress,
    };
    localStorage.setItem('all-states', JSON.stringify(objState));
  }


public httpPost(url: string, body, options?): Observable<any> {
  return this.http.post(url, body, {headers: {Authorization: `Bearer ${this.accessToken}`}});
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
}
