import { Component, OnInit, ElementRef, HostListener, Input } from '@angular/core';

@Component({
  selector: 'app-splitter',
  templateUrl: './splitter.component.html',
  styleUrls: ['./splitter.component.scss']
})
export class SplitterComponent implements OnInit {
  controller: any;
  before: any;
  after: any;

  private _parent: any;
  private _md: boolean;
  private _startCoord: number;
  private _offsetController: number;
  private _box: any;

  constructor(public element: ElementRef) { }

  @Input() direction: string;
  @Input() left: any;
  @Input() right: any;
  @Input() min: number;
  @Input() max: number;
  // @Input() positionTop: number;
  @Input() positionLeft: number;

  ngOnInit() {
    // console.log(this.element.nativeElement.querySelector('.splitters'));
    this.element.nativeElement.querySelector('.splitters').style.left = this.positionLeft + 'px';
    const a = this.element.nativeElement.parentNode;
    if (this.left === '') { this.left = true; }
    if (this.right === '') { this.right = true; }
    for (let index = 1; index < a.childNodes.length; index++) {
      const el = a.childNodes[index];
      if (el === this.element.nativeElement) {
        this.controller = el;
        if (index - 1 >= 0) { this.before = a.childNodes[index - 1]; }
        if (index + 1 <= a.childNodes.length - 1) { this.after = a.childNodes[index + 1]; }
        break;
      }
    }
  }

  @HostListener('mousedown', ['$event'])
  onMouseDown(event: MouseEvent) {
    if (event.buttons !== 0 && event.button !== 0) { return; }
    this.before.style.userSelect = 'none';
    this.after.style.userSelect = 'none';
    this._md = true;
    this._parent = this.element.nativeElement.parentNode;
    this._startCoord = this.controller.getBoundingClientRect().left;
    this._offsetController = event.clientX;
    if (this.left) {
      this._box = this.before.getBoundingClientRect();
    }
    if (this.right) {
      this._box = this.after.getBoundingClientRect();
    }
  }

  @HostListener('document:mouseup')
  onMouseUp(event: MouseEvent) {
    if (this._md) {
      this.before.style.userSelect = 'auto';
      this.after.style.userSelect = 'auto';
      this._md = false;
      window.requestAnimationFrame(() => {
        window.dispatchEvent(new Event('resize'));
      });
    }
  }

  @HostListener('document:mousemove', ['$event'])
  onMouseMove(event: MouseEvent) {
    if (this._md) {
      if (event.buttons === 0) { this._md = false; return; }

      let new_width;
      if (this.left) {
        new_width = this._box.width + (event.clientX - this._offsetController);
      }
      if (this.right) {
        new_width = this._box.width - (event.clientX - this._offsetController);
      }

      if (this.min && new_width < Number(this.min)) { new_width = Number(this.min); }
      if (this.max && new_width > Number(this.max)) { new_width = Number(this.max); }
      if (this.left) {
        this.before.style.width = new_width + 'px';
        this.before.style.maxWidth = new_width + 'px';
        this.before.style.minWidth = new_width + 'px';
      }
      if (this.right) {
        this.after.style.width = new_width + 'px';
        this.after.style.maxWidth = new_width + 'px';
        this.after.style.minWidth = new_width + 'px';
      }

      window.requestAnimationFrame(() => {
        window.dispatchEvent(new Event('resize'));
      });
    }
  }
}
