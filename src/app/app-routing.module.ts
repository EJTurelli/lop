import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ListsComponent } from './components/lists/lists.component';
import { ListComponent } from './components/list/list.component';
import { HomeComponent } from './components/home/home.component';

import { AuthGuard } from './guards/auth.guard';


const ROUTES: Routes = [
  { path: 'home', component: HomeComponent },
  { path: 'lists', component: ListsComponent, canActivate: [AuthGuard] },
  { path: 'list/:uid', component: ListComponent, canActivate: [AuthGuard] },
  { path: '**', pathMatch: 'full', redirectTo: 'home'}  
];

@NgModule({
  imports: [RouterModule.forRoot(ROUTES, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
