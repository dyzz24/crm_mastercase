import { Component, OnInit, Input, Inject } from '@angular/core';
import { EmailServiceService } from '../../email-service.service';
import { Observable, Subscription } from 'rxjs';
import { Router, ActivatedRoute} from '@angular/router';
import { HttpClient } from '@angular/common/http';
@Component({
  selector: 'app-signature-list',
  templateUrl: './signature-list.component.html',
  styleUrls: ['./signature-list.component.scss']
})
export class SignatureListComponent implements OnInit {

  succes_search_flag = false;
  not_succes_search_flag = false;
  selected_checkbox_for_html = [];
  subscription: Subscription;
  id_selected_letter: Array<number> = [];
  @Input() email_id: string;
  constructor(@Inject(EmailServiceService) public emailServ: EmailServiceService,
  private http: HttpClient,
  private activatedRoute: ActivatedRoute
  ) { }

  ngOnInit() {
    this.subscription = this.activatedRoute.params.subscribe(params => {
      console.log(params);
    });
  }


  scroll_up() {
    const toTopBlock = document.querySelector('.wrapper');
    toTopBlock.scroll(0, 0);
  }

}
