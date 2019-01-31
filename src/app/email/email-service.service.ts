import { Injectable} from '@angular/core';
import { Router, ActivatedRoute} from '@angular/router';
import {global_params} from '../global';
import { Subject, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { AuthorizationService } from '../authorization.service';



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
  ip = global_params.ip;

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
  draft_list = []; // все шаблоны конверты
  public draft_list_edited = new Subject<any>();


  constructor( private rout: Router, private activatedRoute: ActivatedRoute,
    private http: HttpClient, private authorizationServ: AuthorizationService) {
  }

  public httpPost(url: string, body, options?): Observable<any> {
    return this.http.post(url, body, {headers: {Authorization: `Bearer ${this.authorizationServ.accessToken}`}});
  }


  delete_template(draft_id) {
    this.draft_list.filter((val, ind, arr) => { // прохожусь по массиву всех конвертиков
          if  (+val.draft_id === +draft_id)  { // если нашлись
            arr.splice(ind, 1);
            this.draft_list_edited.next('delete');
          }
        });
        // this.httpPost(`${global_params.ip}/mail/setbox`, {
        //   draftId: +draft_id,
        //   boxId: +3,
        //   address: this.idPostForHTTP
        // }).subscribe();



        // так как Денис захотел возможность удалять шаблоны из 3го окна
            // а это не связанный с колбасой компонент
            // пришлось связывать их общим сервером
            // но возникла трудность с шаблонами которые чекбоксены (чекбокс не слетал при удалении)
            // поэтому я отправляю компоненту списка шаблонов (колбасе)
            // событие, что бы тот снял чекбоксы (вызвал ф-ю снятия)
            // он подписан на это событие
  }

  important_template(flagged, draft_id) {
    this.httpPost(
      `${global_params.ip}/mail/draft_update`,
      {id: draft_id,
        flagged: !flagged,
        address: this.idPostForHTTP // смена шаблона на избранное
      }).subscribe((data) => {});

      this.draft_list.filter((val, ind, arr) => { // прохожусь по массиву всех конвертиков
        if  (+val.draft_id === +draft_id)  { // если нашлись
          val.flagged = !flagged; // меняю флаг на противоположное значение того, которое принимает
        }
      });

      this.draft_list_edited.next(flagged); // отправляю флаг для изменения в компоненте new message звездочки
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
