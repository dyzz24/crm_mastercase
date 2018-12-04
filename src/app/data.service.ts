import { Injectable } from '@angular/core';



@Injectable({
  providedIn: 'root'
})
export class DataService {
  public statusNotife = ['not-notif', 'easy', 'medium', 'hard'];
  public notifOne = this.statusNotife[1];
  public notifTwo = this.statusNotife[3];
  public menuActive: number;
  public newMessages = [];

  // header-notif states
  public activeComp = 0;
  public hidden = false;

  public headCompShow(params: number) {
    if (this.activeComp === params) {
      this.activeComp = 0;
      this.hidden = false;
    } else {
     this.activeComp = params;
     this.hidden = true;
    }
   }
   public cancelNotife() {
     this.activeComp = 0;
      this.hidden = false;
   }

  constructor() {
    }
  onClearNotifOne() {
    this.notifOne = this.statusNotife[0];
  }
  onClearNotifTwo() {
    this.notifTwo = this.statusNotife[0];
  }

}
