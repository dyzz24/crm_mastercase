import { Injectable, Inject } from '@angular/core';
import { EmailServiceService } from '../email-service.service';

@Injectable({
  providedIn: 'root'
})
export class NewMessageService {

public files = []; // файлы с инпута
public files_for_view = []; // имена файлов для HTML

  constructor(@Inject(EmailServiceService) public emailServ: EmailServiceService) {

   }
}
