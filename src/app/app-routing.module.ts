import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GruposComponent } from './components/grupos/grupos.component';
import { SubGruposComponent } from './components/sub-grupos/sub-grupos.component';
import { ProductosComponent } from './components/productos/productos.component';
import { NuevoProductoComponent } from './components/nuevo-producto/nuevo-producto.component';
import { PreciosProductosComponent } from './components/precios-productos/precios-productos.component';
import { CarritoComponent } from './components/carrito/carrito.component';
import { BuscarProductoComponent } from './components/buscar-producto/buscar-producto.component';
import { EdicionProductoComponent } from './components/edicion-producto/edicion-producto.component';
import { InicioComponent } from './components/inicio/inicio.component';
import { PrecioPorProductoComponent } from './components/precio-por-producto/precio-por-producto.component';

const routes: Routes = [
  { path: '', redirectTo: 'inicio', pathMatch: 'full' },
  { path: 'inicio', component: InicioComponent },
  { path: 'grupos', component: GruposComponent },
  { path: 'subgrupos', component: SubGruposComponent },
  { path: 'productos', component: ProductosComponent },
  { path: 'nuevo_producto', component: NuevoProductoComponent },
  { path: 'editar_producto/:id', component: EdicionProductoComponent },
  { path: 'precio_producto', component: PreciosProductosComponent },
  { path: 'precio_por_producto', component: PrecioPorProductoComponent },
  { path: 'carrito', component: CarritoComponent },
  { path: 'buscar', component: BuscarProductoComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
