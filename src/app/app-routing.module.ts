import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GruposComponent } from './components/grupos/grupos.component';
import { SubGruposComponent } from './components/sub-grupos/sub-grupos.component';
import { ProductosComponent } from './components/productos/productos.component';
import { NuevoProductoComponent } from './components/nuevo-producto/nuevo-producto.component';
import { PreciosProductosComponent } from './components/precios-productos/precios-productos.component';

const routes: Routes = [
  { path: '', redirectTo: 'grupos', pathMatch: 'full' },
  { path: 'grupos', component: GruposComponent },
  { path: 'subgrupos', component: SubGruposComponent },
  { path: 'productos', component: ProductosComponent },
  { path: 'nuevo_producto', component: NuevoProductoComponent },
  { path: 'precio_producto', component: PreciosProductosComponent },

];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
