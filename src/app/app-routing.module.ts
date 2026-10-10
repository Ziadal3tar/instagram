import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { RegesterComponent } from './components/regester/regester.component';
import { NavComponent } from './components/nav/nav.component';
import { LoginComponent } from './components/login/login.component';
import { ProfileComponent } from './components/profile/profile.component';
import { ExploreComponent } from './components/explore/explore.component';
import { ReelsComponent } from './components/reels/reels.component';
import { CreateComponent } from './components/create/create.component';
import { SettingComponent } from './components/setting/setting.component';
import { MessageComponent } from './components/message/message.component';
import { loginGuard } from './services/login.guard';
import { logoutGuard } from './services/logout.guard';

const routes: Routes = [
  { path: 'register', canActivate: [logoutGuard], component: RegesterComponent },
  { path: 'login', canActivate: [logoutGuard], component: LoginComponent },
  {
    path: '',
    component: NavComponent,
    canActivate: [loginGuard],
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'home' },
      { path: 'home', component: HomeComponent },
      { path: 'explore', component: ExploreComponent },
      { path: 'reels', component: ReelsComponent },
      { path: 'create', component: CreateComponent },
      { path: 'messages', component: MessageComponent },
      { path: 'settings', component: SettingComponent },
      { path: 'userProfile/:id', component: ProfileComponent },
      { path: 'profile/:id', pathMatch: 'full', redirectTo: 'userProfile/:id' },
    ],
  },
  { path: '**', redirectTo: 'home' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true, scrollPositionRestoration: 'top' })],
  exports: [RouterModule],
})
export class AppRoutingModule {}
