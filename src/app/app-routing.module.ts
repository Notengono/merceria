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
import { PorDiaComponent } from './components/informes/por-dia/por-dia.component';
import { InfPresupuestoComponent } from './components/informes/inf-presupuesto/inf-presupuesto.component';
import { LoginComponent } from './components/login/login.component';
import { AuthGuard } from './guards/auth.guard';
import { ListadoComponent } from './components/usuarios/listado/listado.component';
import { NuevoComponent } from './components/usuarios/nuevo/nuevo.component';

const routes: Routes = [
  { path: '', redirectTo: 'inicio', pathMatch: 'full' },
  { path: 'login', component: LoginComponent, pathMatch: "full" },
  { path: 'inicio', component: InicioComponent, pathMatch: "full", canActivate: [AuthGuard] },
  { path: 'grupos', component: GruposComponent, pathMatch: "full", canActivate: [AuthGuard] },
  { path: 'subgrupos', component: SubGruposComponent, pathMatch: "full", canActivate: [AuthGuard] },
  { path: 'productos', component: ProductosComponent, pathMatch: "full", canActivate: [AuthGuard] },
  { path: 'nuevo_producto', component: NuevoProductoComponent, pathMatch: "full", canActivate: [AuthGuard] },
  { path: 'editar_producto/:id', component: EdicionProductoComponent, pathMatch: "full", canActivate: [AuthGuard] },
  { path: 'precio_producto', component: PreciosProductosComponent, pathMatch: "full", canActivate: [AuthGuard] },
  { path: 'precio_por_producto', component: PrecioPorProductoComponent, pathMatch: "full", canActivate: [AuthGuard] },
  { path: 'carrito', component: CarritoComponent, pathMatch: "full", canActivate: [AuthGuard] },
  { path: 'buscar', component: BuscarProductoComponent, pathMatch: "full", canActivate: [AuthGuard] },
  { path: 'inf_diario', component: PorDiaComponent, pathMatch: "full", canActivate: [AuthGuard] },
  { path: 'inf_presupuesto', component: InfPresupuestoComponent, pathMatch: "full", canActivate: [AuthGuard] },
  { path: 'listadoUsuarios', component: ListadoComponent, pathMatch: "full", canActivate: [AuthGuard] },
  { path: 'nuevoUsuario', component: NuevoComponent, pathMatch: "full", canActivate: [AuthGuard] }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
