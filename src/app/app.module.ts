import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { DataService } from './data.service';
import { AppComponent } from './app.component';
import { MenuComponent } from './menu/menu.component';
import { HeaderComponent } from './header/header.component';
import { HeaderLeftComponent } from './header/header-left/header-left.component';
import { HeaderRightComponent } from './header/header-right/header-right.component';
import { NotificationOneComponent } from './header/notification-one/notification-one.component';
import { NotificationTwoComponent } from './header/notification-two/notification-two.component';
import { AppRoutingModule } from './app-routing.module';
import { HeaderProfileComponent } from './header/header-profile/header-profile.component';
import { EmailComponent } from './email/email.component';
import { EmailListComponent } from './email/email-list/email-list.component';
import { LettersComponent } from './email/letters/letters.component';
import { EmailServiceService } from './email/email-service.service';
import { EmailViewComponent } from './email/email-view/email-view.component';
import { FormsModule } from '@angular/forms';
import { NewMessageComponent } from './email/new-message/new-message.component';
import { QuillModule } from 'ngx-quill';
import { HttpClientModule } from '@angular/common/http';
import { InnerhtmlPipe } from './email/innerhtml.pipe';
import { InnerTextPipe } from './email/innerhtml.pipe';
// import { InnerTextPipe } from './email/inner-text.pipe';








@NgModule({
  declarations: [
    AppComponent,
    MenuComponent,
    HeaderComponent,
    HeaderLeftComponent,
    HeaderRightComponent,
    NotificationOneComponent,
    NotificationTwoComponent,
    HeaderProfileComponent,
    EmailComponent,
    EmailListComponent,
    LettersComponent,
    EmailViewComponent,
    NewMessageComponent,
    InnerhtmlPipe,
    InnerTextPipe,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    QuillModule,
    HttpClientModule
  ],
  providers: [DataService, EmailServiceService],
  bootstrap: [AppComponent]
})
export class AppModule { }
