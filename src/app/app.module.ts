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
import {SettingModule} from './setting/setting.module';
import { AuthorizationComponent } from './authorization/authorization.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HomeComponent } from './home/home.component';
import { BubbleModuleModule } from './bubble-module/bubble-module.module';



@NgModule({
  declarations: [
    AppComponent,
    MenuComponent,
    HeaderComponent,
    HeaderRightComponent,
    NotificationOneComponent,
    NotificationTwoComponent,
    HeaderProfileComponent,
    AuthorizationComponent,
    HomeComponent,


  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    EmailModuleModule,
    BubbleModuleModule,
    SettingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule

  ],
  providers: [AuthorizationService, DataService, SocketService ],
  bootstrap: [AppComponent]
})
export class AppModule { }
