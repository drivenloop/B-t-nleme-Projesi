import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { SignUpComponent } from './components/sign-up/sign-up.component';
import { MessageComponent } from './components/message/message.component';
import {
  canActivate,
  redirectUnauthorizedTo,
  redirectLoggedInTo,
} from '@angular/fire/auth-guard';
import { ProfileComponent } from './components/profile/profile.component';
import { FormsComponent } from './components/forms/forms.component';
import { AnswersComponent } from './components/answers/answers.component';
import { FormdetailComponent } from './components/formdetail/formdetail.component';

const redirectToLogin = () => redirectUnauthorizedTo(['login']);
const redirectToHome = () => redirectLoggedInTo(['home']);

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    component: LoginComponent,
  },
  {
    path: 'login',
    component: LoginComponent,
    ...canActivate(redirectToHome),
  },
  {
    path: 'sign-up',
    component: SignUpComponent,
    ...canActivate(redirectToHome),
  },
  {
    path: 'message',
    component: MessageComponent,
    ...canActivate(redirectToLogin),
  },
  {
    path: 'forms',
    component: FormsComponent,
    ...canActivate(redirectToLogin),
  },
  {
    path: 'answers',
    component: AnswersComponent,
    ...canActivate(redirectToLogin),
  },
  {
    path: 'profile',
    component: ProfileComponent,
    ...canActivate(redirectToLogin),
  },
  { path: 'forms/:id', component: FormdetailComponent,...canActivate(redirectToLogin), },
];

@NgModule({
  declarations: [],
  imports: [CommonModule, RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule { }
