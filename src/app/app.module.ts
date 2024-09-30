import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { GruposComponent } from './components/grupos/grupos.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { SubGruposComponent } from './components/sub-grupos/sub-grupos.component';
import { ProductosComponent } from './components/productos/productos.component';
import { NuevoProductoComponent } from './components/nuevo-producto/nuevo-producto.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FiltroPipe } from './pipes/filtro.pipe';
import { PreciosProductosComponent } from './components/precios-productos/precios-productos.component';
import { CarritoComponent } from './components/carrito/carrito.component';
import { EdicionProductoComponent } from './components/edicion-producto/edicion-producto.component';
import { BuscarProductoComponent } from './components/buscar-producto/buscar-producto.component';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { InicioComponent } from './components/inicio/inicio.component';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { PrecioPorProductoComponent } from './components/precio-por-producto/precio-por-producto.component';
import { PorDiaComponent } from './components/informes/por-dia/por-dia.component';
import { InfPresupuestoComponent } from './components/informes/inf-presupuesto/inf-presupuesto.component';
import { LoginComponent } from './components/login/login.component';
import { NuevoComponent } from './components/usuarios/nuevo/nuevo.component';
import { ListadoComponent } from './components/usuarios/listado/listado.component';
import { CambioClaveComponent } from './components/usuarios/cambio-clave/cambio-clave.component';
import { TokenInterceptorService } from './services/token-interceptor.service';

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
    BuscarProductoComponent,
    InicioComponent,
    PrecioPorProductoComponent,
    PorDiaComponent,
    InfPresupuestoComponent,
    LoginComponent,
    NuevoComponent,
    ListadoComponent,
    CambioClaveComponent
  ],
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatAutocompleteModule,
    MatSnackBarModule,
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    NoopAnimationsModule,
    
  ],
  providers: [{
    provide: HTTP_INTERCEPTORS,
    useClass: TokenInterceptorService,
    multi: true
  }],
  bootstrap: [AppComponent]
})
export class AppModule { }
