import { HttpClient, HttpHeaders } from "@angular/common/http";
import { environment } from 'src/environments/environment';
import { Injectable } from '@angular/core';
import { ProductosI } from '../model/productos-i';
import { ProductoDetalleI } from "../model/producto-detalle";


const apiURL = environment.apiURL;

@Injectable({
  providedIn: 'root'
})

export class ProductosService {

  constructor(private _http: HttpClient) { }

  postProductos(valor: any) {
    const header = new HttpHeaders();
    header.append("Content-Type", "applications/json");
    return this._http.post<any>(
      `${apiURL}productos`, valor, { headers: header });
  }

  postProducto(valor: any) {
    const header = new HttpHeaders();
    header.append("Content-Type", "applications/json");
    return this._http.post<ProductoDetalleI>(
      `${apiURL}producto`, valor, { headers: header });
  }

  putProducto(valor: any) {
    const header = new HttpHeaders();
    header.append("Content-Type", "applications/json");
    return this._http.put(
      `${apiURL}producto`, valor, { headers: header });
  }

  postNuevoPrecio(valor1: any, valor2: any) {
    const header = new HttpHeaders();
    header.append("Content-Type", "applications/json");
    return this._http.post<any>(
      `${apiURL}postNuevoPrecio`, { valor1, valor2 }, { headers: header });
  }

  postNuevoPrecioIndividual(valor: any) {
    const header = new HttpHeaders();
    header.append("Content-Type", "applications/json");
    return this._http.post<any>(
      `${apiURL}postNuevoPrecioIndividual`, valor, { headers: header });
  }

  getProduto(valor: any) {
    const header = new HttpHeaders();
    header.append("Content-Type", "applications/json");
    console.clear()
    return this._http.get<any>(
      `${apiURL}producto/${valor}`, { headers: header });
  }

  getProdutos(valor: any) {
    const header = new HttpHeaders();
    header.append("Content-Type", "applications/json");
    console.clear()
    return this._http.get<any>(
      `${apiURL}getProductos/${valor}`, { headers: header });
  }

  getProdutoMeta(valor: any) {
    const header = new HttpHeaders();
    header.append("Content-Type", "applications/json");
    console.clear()
    return this._http.get<any>(
      `${apiURL}getProdutoMeta/${valor}`, { headers: header });
  }

  getPrecios(valor: any) {
    const header = new HttpHeaders();
    header.append("Content-Type", "applications/json");
    console.clear()
    return this._http.get<any>(
      `${apiURL}getPrecios/${valor}`, { headers: header });
  }
}
