import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { RegesterComponent } from './components/regester/regester.component';
import { NavComponent } from './components/nav/nav.component';
import { LoginComponent } from './components/login/login.component';
import { loginGuard } from './services/login.guard';
import { logoutGuard } from './services/logout.guard';
import { ProfileComponent } from './components/profile/profile.component';


const routes: Routes = [
  {path:'',redirectTo:`userProfile/${localStorage.getItem('id')}`,pathMatch:'full'},
  // {path: 'home',canActivate:[loginGuard], component:NavComponent},
  {path: 'register',canActivate:[logoutGuard], component:RegesterComponent},
  {path: 'login',canActivate:[logoutGuard], component:LoginComponent},
  {path: 'userProfile/:id',canActivate:[loginGuard], component:NavComponent},

];
@NgModule({
  imports: [RouterModule.forRoot(routes,{useHash:true})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
