import { GiftesComponent } from './gifts/gifts.component';
import { AppComponent } from './app.component';
import { NgModule }      from '@angular/core';

import { RouterModule, Routes } from '@angular/router';

import { AuthGuard } from './providers/auth.service';
import { MembersComponent } from './members/members.component';
import { ModuleWithProviders } from '@angular/core';

import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { EmailComponent } from './email/email.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';


const routes: Routes = [
    { path: '',
      redirectTo: '/login',
      pathMatch: 'full' },
    { path: 'login',
      component: EmailComponent },
    { path: 'signup',
      component: SignupComponent, canActivate: [AuthGuard] },
    { path: 'login-email',
      component: EmailComponent },
    { path: 'members',
      component: MembersComponent, canActivate: [AuthGuard] },
    {
      path: 'gifts/:person',
      component: GiftesComponent
    },
    { path: '**', component: PageNotFoundComponent },

]

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRoutingModule {}
