import { Injectable, Inject } from '@angular/core';
import { EmailServiceService } from '../email-service.service';

@Injectable({
  providedIn: 'root'
})
export class NewMessageService {

public to = []; // array for send
public copy = []; // array for send copy
public hidden_copy = []; // array for send hidd copy
public subject = ''; // subject

public messages;
public messages_sending = false;
public files = []; // файлы с инпута
public files_for_view = []; // имена файлов для HTML
public formData = new FormData(); // дата для отправки на серв файлов
public open_select_address = false;

save_tmp_state = false;
tmp_name;

  constructor(@Inject(EmailServiceService) public emailServ: EmailServiceService) {

   }

  new_message_from_template(param_to_answer?, param_to_subject?, param_to_cc?, param_to_bcc?, param_html?) {
    this.new_clear_message();
    if (param_to_answer) {
    this.to = param_to_answer.map(val => {
      return val.address;
    });
  }
    this.messages = param_html;
if (param_to_cc) {
    this.copy = param_to_cc.map(val => {
      return val.address;
    });
  }
  if (param_to_bcc) {
    this.hidden_copy = param_to_bcc.map(val => {
      return val.address;
    });
  }
    this.subject = param_to_subject;
  }
  new_replyMessage(param_to_answer?, param_to_subject?, param_text?, param_html?) {
    this.new_clear_message();
    this.to = [param_to_answer];
     this.subject = `RE: ${param_to_subject}`;
     if (param_html === null) {
      this.messages = param_text;
     } else {
      this.messages = param_html;
     }
   }
   new_reply_allMessage(param_to_answer?, param_to_all_answer?, param_to_subject?, param_text?, param_html?) {
    this.new_clear_message();
    const newArray = [];
    this.to = [param_to_answer];
    this.subject = `RE: ${param_to_subject}`;
    if (param_html === null) {
      this.messages = param_text;
    } else {
      this.messages = param_html;
    }
    param_to_all_answer.filter(val => {
      if (val.address !== this.emailServ.idPostForHTTP && val.address !== param_to_answer) {

        newArray.push(val.address);
      }
      this.copy = newArray;
    });
  }
  new_forward_message(param_text, param_html) {
    this.new_clear_message();
    if (param_html === null) {
      this.messages = param_text;
    } else {
      this.messages = param_html;
    }
  }
  new_clear_message() {
    this.to = [];
    this.subject = '';
    this.messages = '';
    this.emailServ.hiddenEmpty = true;
    this.copy = [];
    this.hidden_copy = [];
    this.files = [];
    this.files_for_view = [];
  }
}
