import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { EmailComponent } from './email/email.component';
import { LettersComponent } from './email/letters/letters.component';
import { EmailViewComponent } from './email/email-view/email-view.component';
import { NewMessageComponent } from './email/new-message/new-message.component';
import { AppComponent } from './app.component';
import { EmailGuardGuard } from './email/email-guard.guard';



const routes: Routes = [
  { path: '', component: AppComponent },
  { path: 'email', component: EmailComponent,
  children:
  [
    {path: ':id1/:id', component: LettersComponent, canActivate: [EmailGuardGuard],
          children:
          [{path: 'view/:id', component: EmailViewComponent},
            {path: 'create', component: NewMessageComponent},
            {path: ':id/:id/create', component: NewMessageComponent}]}
  ]
},

];






@NgModule({
  imports: [RouterModule.forRoot(routes),
    CommonModule
  ],
  declarations: [],
  exports: [ RouterModule ]
})
export class AppRoutingModule { }
