import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SettingComponent } from './setting.component';
import { LoginComponent } from './login/login';

const routes: Routes = [
  { path: 'setting', component: SettingComponent,
children: [
      {path: 'login', component: LoginComponent}
]}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SettingRoutingModule { }
