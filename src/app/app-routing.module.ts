import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GruposComponent } from './components/grupos/grupos.component';
import { SubGruposComponent } from './components/sub-grupos/sub-grupos.component';

const routes: Routes = [
  { path: '', redirectTo: 'grupos', pathMatch: 'full' },
  { path: 'grupos', component: GruposComponent },
  { path: 'subgrupos', component: SubGruposComponent },

];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
