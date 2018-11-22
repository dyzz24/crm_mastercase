import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { EmailComponent } from './email/email.component';
import { LettersComponent } from './email/letters/letters.component';
import { EmailViewComponent } from './email/email-view/email-view.component';
import { NewMessageComponent } from './email/new-message/new-message.component';



const routes: Routes = [
  { path: 'email', component: EmailComponent,
  children:
  [
    {path: ':id/inbox', component: LettersComponent,
          children:
          [{path: 'view/:id', component: EmailViewComponent},
            {path: 'create', component: NewMessageComponent}]},
    {path: ':id/sent', component: LettersComponent,
          children:
          [{path: 'view/:id', component: EmailViewComponent},
            {path: 'create', component: NewMessageComponent}]},
    {path: ':id/spam', component: LettersComponent,
          children:
          [{path: 'view/:id', component: EmailViewComponent},
          {path: 'create', component: NewMessageComponent}
            ]},
    {path: ':id/delete', component: LettersComponent,
          children:
          [{path: 'view/:id', component: EmailViewComponent},
          {path: 'create', component: NewMessageComponent}
            ]}
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
