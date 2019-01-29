import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EmailComponent } from '../email/email.component';
import { LettersComponent } from '../email/letters/letters.component';
import { EmailViewComponent } from '../email/email-view/email-view.component';
import { NewMessageComponent } from '../email/new-message/new-message.component';
import { EmailGuardGuard } from '../email/email-guard.guard';
import { TemplateLetterListComponent } from './template-letter-list/template-letter-list.component';
import { AddEmailComponent } from './add-email/add-email.component';
import { EmptyTemplateComponent } from './empty-template/empty-template.component';

const routes: Routes = [
  { path: 'email', component: EmailComponent, canActivate: [EmailGuardGuard],
  children:
  [
    {path: ':email_id/template', component: TemplateLetterListComponent, canActivate: [EmailGuardGuard],
  children: [{path: 'create', component: NewMessageComponent},

              {path: '**', component: EmptyTemplateComponent}]
  },

    {path: ':id1/:id', component: LettersComponent, canActivate: [EmailGuardGuard],
          children:
          [{path: 'view/:id', component: EmailViewComponent},
            {path: 'create', component: NewMessageComponent},
            {path: ':id/:id/create', component: NewMessageComponent}]},
  ]
},
{path: ':id/add_email', component: AddEmailComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EmailModuleRoutingModule { }
