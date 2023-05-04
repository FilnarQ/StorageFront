import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CellViewComponent } from './components/cell-view/cell-view.component';
import { LoginComponent } from './components/login/login.component';

const routes: Routes = [
  {path:'', pathMatch:'full', redirectTo:'login'},
  {path:'login', pathMatch:'full', component:LoginComponent},
  {path:'cell', pathMatch:'full', component:CellViewComponent},
  {path:'**', pathMatch:'full', redirectTo:'login'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
