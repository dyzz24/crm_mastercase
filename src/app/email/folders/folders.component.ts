import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-folders',
  templateUrl: './folders.component.html',
  styleUrls: ['./folders.component.scss']
})
export class FoldersComponent implements OnInit {
  folder_create = false;
  @Input() user_folders;

  constructor() { }

  ngOnInit() {
  }
  open_folders_settings() {
    this.folder_create = true;

  }
  closeViewer(e) {
      this.folder_create = ! this.folder_create;

  }

}
