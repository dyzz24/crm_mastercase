import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EmailComponent } from '../email/email.component';
import { LettersComponent } from '../email/letters/letters.component';
import { EmailViewComponent } from '../email/email-view/email-view.component';
import { FormsModule } from '@angular/forms';
import { NewMessageComponent } from '../email/new-message/new-message.component';
import { QuillModule } from 'ngx-quill';
import { InnerhtmlPipe } from '../email/email-pipes/innerhtml.pipe';
import { InnerTextPipe } from '../email/email-pipes/inner-text.pipe';
import { ReactiveFormsModule} from '@angular/forms';
import { SplitterComponent } from '../email/splitter/splitter.component';
import { TimerPipePipe } from '../email/email-pipes/timer-pipe.pipe';
import { AttachPipePipe } from '../email/email-pipes/attach-pipe.pipe';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule, ToastContainerModule } from 'ngx-toastr';
import { TemplateComponent } from '../email/template/template.component';
import { PreserverComponent } from '../preserver/preserver.component';
import { FoldersComponent } from '../email/folders/folders.component';
import { FoldersListComponent } from '../email/letters/folders-list/folders-list.component';
import { SizerPipe } from '../email/email-pipes/sizer.pipe';
import { EmailServiceService } from '../email/email-service.service';
import { EmailModuleRoutingModule } from './email-module-routing.module';
import {NewMessageService} from '../email/new-message/new-message.service';
import { TemplateLetterListComponent } from './template-letter-list/template-letter-list.component';
import { AddEmailComponent } from './add-email/add-email.component';
import { EmailHeaderComponent } from './email-header/email-header.component';
import { EmptyTemplateComponent } from './empty-template/empty-template.component';
import { EmptyLettersComponent } from './empty-letters/empty-letters.component';

@NgModule({
  imports: [
    CommonModule,
    EmailModuleRoutingModule,
    FormsModule,
    QuillModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot(),
    ToastContainerModule
  ],
  declarations: [
    EmailComponent,
    LettersComponent,
    EmailViewComponent,
    NewMessageComponent,
    InnerhtmlPipe,
    InnerTextPipe,
    SplitterComponent,
    TimerPipePipe,
    AttachPipePipe,
    TemplateComponent,
    PreserverComponent,
    FoldersComponent,
    FoldersListComponent,
    SizerPipe,
    TemplateLetterListComponent,
    AddEmailComponent,
    EmailHeaderComponent,
    EmptyTemplateComponent,
    EmptyLettersComponent,
  ],
  providers: [EmailServiceService, NewMessageService],
})
export class EmailModuleModule { }
