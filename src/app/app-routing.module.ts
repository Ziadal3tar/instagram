import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { RegesterComponent } from './components/regester/regester.component';
import { NavComponent } from './components/nav/nav.component';
import { LoginComponent } from './components/login/login.component';


const routes: Routes = [
  {path:'',redirectTo:"home",pathMatch:'full'},
  {path: 'home', component:NavComponent},
  {path: 'register', component:RegesterComponent},
  {path: 'login', component:LoginComponent},

];
@NgModule({
  imports: [RouterModule.forRoot(routes,{useHash:true})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
