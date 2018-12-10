import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-template',
  templateUrl: './template.component.html',
  styleUrls: ['./template.component.scss']
})
export class TemplateComponent implements OnInit {

  show_hidden_templ = false;

  constructor() { }

  ngOnInit() {
  }

  show_hide_templ() {
      this.show_hidden_templ = ! this.show_hidden_templ;
  }

}
