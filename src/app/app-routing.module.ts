import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { AuthorizationComponent } from './authorization/authorization.component';
import { HomeComponent } from './home/home.component';




const routes: Routes = [
  { path: '', component: AppComponent },
  { path: 'auth', component: AuthorizationComponent},
  { path: 'home', component : HomeComponent}
  // { path: 'email',  redirectTo: '/email', pathMatch: 'full'}
];






@NgModule({
  imports: [RouterModule.forRoot(routes),
    CommonModule
  ],
  declarations: [],
  exports: [ RouterModule ]
})
export class AppRoutingModule { }
