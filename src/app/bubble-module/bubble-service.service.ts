import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BubbleServiceService {

  public cancell_all_bables = new Subject<any>();

  constructor() { }

}
