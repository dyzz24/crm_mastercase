import { Injectable} from '@angular/core';

import { HttpClientModule } from '@angular/common/http';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';

import { AllEmails } from './test';

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
  step = 15;

  noMessages = false; // DEL

  constructor(private http: HttpClient) {
    if (localStorage.getItem('all-states') === null) {
      return;
    } else {
      const state = JSON.parse(localStorage.getItem('all-states'));
      this.idBox = state.idBox;
      this.typeMess = state.typeMess;
      this.activeLett = state.activeLett;
      this.mailName = state.mailName;
      this.senderName = state.senderName;
      this.time = state.time;
      this.avatar = state.avatar;
      this.caption = state.caption;
      this.text = state.text;
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
    }
  }

  stateServ() {
    const objState = {
      idBox: this.idBox,
      typeMess: this.typeMess,
      activeLett: this.activeLett,
      mailName: this.mailName,
      senderName: this.senderName,
      time: this.time,
      avatar: this.avatar,
      caption: this.caption,
      text: this.text,
      selectedMess: this.selectedMess,
      urlParams: this.urlParams,
      messageState: this.messageState,
      activeEl: this.activeEl,
      fullPath: this.fullPath,
      hiddenEmpty: this.hiddenEmpty,
      lettersList: this.lettersList,
      index: this.index,
      result: this.result,
      currentObjectLetter: this.currentObjectLetter,
      currentInd: this.currentInd,
      copy: this.copy,
      inworkLetter: this.inworkLetter,
      haveattachLetter: this.haveattachLetter,
      importantLetter: this.importantLetter,
      visibleLetters: this.visibleLetters,
      noMessages: this.noMessages
    };
    localStorage.setItem('all-states', JSON.stringify(objState));
  }

  public httpGet(url: string, options?): Observable<any> {
    return this.http.get(url, options);
}

public httpPost(url: string, options?): Observable<any> {
  return this.http.post(url, options);
}

//   getHttp(param) {

//     this.http.get(param).subscribe((data) => data );


// // const emails = this.http.get('http://10.0.1.10:3000/boxes?id=1').subscribe((data) => console.log(data)); // http - test

// // const mails = this.http.get('http://10.0.1.10:3000/mails?address=seo@insat.ru').subscribe((data) => console.log(data)); // http - test
//   }

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

  messageConditionCheckerInService(array) {
    if (array !== undefined) {
      this.inworkLetter = false;
      this.haveattachLetter = false;
      this.importantLetter = false;

      for (const key of array) {
        if (key === 'inwork') {
          this.inworkLetter = true;
        }
        if (key === 'haveAttach') {
          this.haveattachLetter = true;
        }
        if (key === 'important') {
          this.importantLetter = true;
        }
      }
      // return {
      //   inworkLetter, haveattachLetter, importantLetter
      // };
    } else {
      return false;
    }
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


  htmlParse(item) {
    const text = item;
    const div = document.createElement('div');
    div.innerHTML = text;
    const returnText = div.textContent || div.innerText || '';
    return returnText;
  }
}
