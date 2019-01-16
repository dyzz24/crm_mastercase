import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { NotFoundComponent } from './not-found/not-found.component';




const routes: Routes = [
  { path: '', component: AppComponent },
  { path: 'not_f', component: NotFoundComponent}
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
