import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BubbleComponent } from './bubble/bubble.component';
import { BubbleMenuComponent } from './bubble-menu/bubble-menu.component';

@NgModule({
  declarations: [BubbleComponent, BubbleMenuComponent],
  imports: [
    CommonModule
  ],
  exports: [BubbleComponent, BubbleMenuComponent]
})
export class BubbleModuleModule { }
