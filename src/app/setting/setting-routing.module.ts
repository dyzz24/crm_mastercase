import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SettingComponent } from './setting.component';
import { NewUserComponent } from './new-user/new-user.component';

const routes: Routes = [
  { path: 'setting', component: SettingComponent,
children: [
      {path: 'new_user', component: NewUserComponent}
]}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SettingRoutingModule { }
