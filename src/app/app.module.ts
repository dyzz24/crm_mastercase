import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { DataService } from './data.service';
import { AppComponent } from './app.component';
import { MenuComponent } from './menu/menu.component';
import { HeaderComponent } from './header/header.component';
import { HeaderRightComponent } from './header/header-right/header-right.component';
import { NotificationOneComponent } from './header/notification-one/notification-one.component';
import { NotificationTwoComponent } from './header/notification-two/notification-two.component';
import { AppRoutingModule } from './app-routing.module';
import { HeaderProfileComponent } from './header/header-profile/header-profile.component';

import { HttpClientModule } from '@angular/common/http';

import { AuthorizationService } from './authorization.service';
import { SocketService } from './socket.service';
import { EmailModuleModule } from './email/email-module.module';



@NgModule({
  declarations: [
    AppComponent,
    MenuComponent,
    HeaderComponent,
    HeaderRightComponent,
    NotificationOneComponent,
    NotificationTwoComponent,
    HeaderProfileComponent,


  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    EmailModuleModule,
    HttpClientModule,

  ],
  providers: [AuthorizationService, DataService, SocketService ],
  bootstrap: [AppComponent]
})
export class AppModule { }
