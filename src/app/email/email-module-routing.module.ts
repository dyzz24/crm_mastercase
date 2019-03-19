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
import { EmptyLettersComponent } from './empty-letters/empty-letters.component';
import { WelcomeComponent } from './add-email/welcome/welcome.component';
import { DraftsComponent } from './drafts/drafts.component';
import { SignatureComponent } from './signature/signature.component';
import { SignatureCreateComponent } from './signature/signature-create/signature-create.component';

const routes: Routes = [

  { path: 'email', component: EmailComponent, canActivate: [EmailGuardGuard],
  children:
  [
    {path: ':email_id/sign', component: SignatureComponent, canActivate: [EmailGuardGuard], children: [
      {path: 'create', component: NewMessageComponent}, {path: '**', component: SignatureCreateComponent}
    ]},
    {path: ':email_id/template', component: TemplateLetterListComponent, canActivate: [EmailGuardGuard],
  children: [{path: 'create', component: NewMessageComponent},

              {path: '**', component: EmptyTemplateComponent}]
  },

  {path: ':email_id/drafts', component: DraftsComponent, canActivate: [EmailGuardGuard],
  children: [{path: 'create', component: NewMessageComponent}, {path: '**', component: EmptyLettersComponent}]
  },

    {path: ':id1/:id', component: LettersComponent, canActivate: [EmailGuardGuard],
          children:
          [{path: 'view/:id', component: EmailViewComponent},
            {path: 'create', component: NewMessageComponent},
            {path: ':id/:id/create', component: NewMessageComponent},
          {path: '**', component: EmptyLettersComponent}]},
  ]
},
{path: 'add_email', component: AddEmailComponent,
children: [{path: 'welcome', component: WelcomeComponent}]}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EmailModuleRoutingModule { }
