import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { SettingRoutingModule } from './setting-routing.module';
import { SettingComponent } from './setting.component';
import { NewUserComponent } from './new-user/new-user.component';

@NgModule({
  imports: [
    CommonModule,
    SettingRoutingModule,
    FormsModule,
    ReactiveFormsModule
  ],
  declarations: [SettingComponent, NewUserComponent]
})
export class SettingModule { }
