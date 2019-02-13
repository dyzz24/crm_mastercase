import { Component, OnInit } from '@angular/core';
import {global_params} from '../../../global';
import {Router} from '@angular/router';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.scss']
})
export class WelcomeComponent implements OnInit {

  constructor(
      private router: Router
  ) { }

  ngOnInit() {
  }

    onSubmit() {
      this.router.navigate(['/email']);
    }

}
