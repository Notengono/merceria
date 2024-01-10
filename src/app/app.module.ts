import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { GruposComponent } from './components/grupos/grupos.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { SubGruposComponent } from './components/sub-grupos/sub-grupos.component';
import { ProductosComponent } from './components/productos/productos.component';
import { NuevoProductoComponent } from './components/nuevo-producto/nuevo-producto.component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FiltroPipe } from './pipes/filtro.pipe';
import { PreciosProductosComponent } from './components/precios-productos/precios-productos.component';
import { CarritoComponent } from './components/carrito/carrito.component';
import { EdicionProductoComponent } from './components/edicion-producto/edicion-producto.component';
import { BuscarProductoComponent } from './components/buscar-producto/buscar-producto.component';

@NgModule({
  declarations: [
    AppComponent,
    GruposComponent,
    NavbarComponent,
    SubGruposComponent,
    ProductosComponent,
    NuevoProductoComponent,
    FiltroPipe,
    PreciosProductosComponent,
    CarritoComponent,
    EdicionProductoComponent,
    BuscarProductoComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
