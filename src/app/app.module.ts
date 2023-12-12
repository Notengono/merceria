import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { GruposComponent } from './components/grupos/grupos.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { SubGruposComponent } from './components/sub-grupos/sub-grupos.component';

@NgModule({
  declarations: [
    AppComponent,
    GruposComponent,
    NavbarComponent,
    SubGruposComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
