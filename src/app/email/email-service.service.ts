import { Injectable} from '@angular/core';
import { Router, ActivatedRoute} from '@angular/router';



@Injectable({
  providedIn: 'root'
})
export class EmailServiceService {
  emails;


  idBox: string; // стринга для подставления в адр. строку браузера - имя ящика
  typeMess: string;
  activeLett: Array<boolean> = []; // активное письмо в lettersList
  hideAvatars: Array<boolean> = [];
  senderName: string;
  time: string;
  avatar: any;
  caption: string;
  text: string;
  selectedMess;
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
  haveResponse = false;

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

  to_answer;
  to_all_answer = [];
  to_subject;
  to_forward;
  to_cc = [];
  to_bcc = [];
  sub;
  folders;
  all_user_mail_address = [];
  counts: number; // счетчик новых писем в папках


  constructor( private rout: Router, private activatedRoute: ActivatedRoute) {
  }





  checkerTrash() { // ф-я проверяет пустые ли выделенные инпуты (аватарки), если нет то открывает меню с действиями
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

  // new_message_from_template(param_to_answer?, param_to_subject?, param_to_cc?, param_to_bcc?, param_html?) {
  //   this.new_clear_message();
  //   this.to_answer = param_to_answer;
  //   this.to_forward = param_html;
  //   this.to_answer = param_to_answer;
  //   this.to_cc = param_to_cc.map(val => {
  //     return val.address;
  //   });
  //   this.to_bcc = param_to_bcc.map(val => {
  //     return val.address;
  //   });
  //   this.to_subject = param_to_subject;
  // }

  // new_replyMessage(param_to_answer?, param_to_subject?, param_text?, param_html?) {
  //  this.new_clear_message();
  //   this.to_answer = param_to_answer;
  //   this.to_subject = `RE: ${param_to_subject}`;
  //   if (param_html === null) {
  //     this.to_forward = param_text;
  //   } else {
  //     this.to_forward = param_html;
  //   }
  // }

  // new_reply_allMessage(param_to_answer?, param_to_all_answer?, param_to_subject?, param_text?, param_html?) {
  //   this.new_clear_message();
  //   const newArray = [];
  //   this.to_answer = param_to_answer;
  //   this.to_subject = `RE: ${param_to_subject}`;
  //   if (param_html === null) {
  //     this.to_forward = param_text;
  //   } else {
  //     this.to_forward = param_html;
  //   }
  //   param_to_all_answer.filter(val => {
  //     if (val.address !== this.idPostForHTTP && val.address !== param_to_answer) {

  //       newArray.push(val.address);
  //     }
  //     this.to_cc = newArray;
  //   });
  // }

  // new_clear_message() {
  //   this.to_answer = '';
  //   this.to_subject = '';
  //   this.to_forward = '';
  //   this.hiddenEmpty = true;
  //   this.to_cc = [];
  //   this.to_bcc = [];
  //   this.files = [];
  // }
  // new_forward_message(param_text, param_html) {
  //   this.new_clear_message();
  //   if (param_html === null) {
  //     this.to_forward = param_text;
  //   } else {
  //     this.to_forward = param_html;
  //   }
  // }
  // newMessage_DblClick(param_to_answer?, param_to_all_answer?, param_to_subject?, param_text?, param_html?) {
  //   this.to_answer = '';
  //   this.to_subject = '';
  //   this.to_all_answer = [];
  //   this.to_forward = '';
  //   // this.rout.navigate([this.idPostForHTTP + '/create']);
  //   // this.fullPath = this.idPostForHTTP + '/create';
  //   this.hiddenEmpty = true;
  //   this.to_answer = param_to_answer;
  //   this.to_subject = param_to_subject;
  //   if (param_html === null) {
  //     this.to_forward = param_text;
  //   } else {
  //     this.to_forward = param_html;
  //   }
  //   if (param_to_all_answer === '') {
  //     return;
  //   } else {
  //   this.to_all_answer = param_to_all_answer.filter(val => {
  //     if (val !== this.idPostForHTTP && val !== param_to_answer) {
  //       return val;
  //     }
  //   });
  // }
  // }


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

      this.cut_addressess_array = [];
      this.cut_addressess_array = this.selectedLetter.to_addresses.slice(0, 3);
  }
}
