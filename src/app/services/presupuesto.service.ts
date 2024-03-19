import { HttpClient, HttpHeaders } from "@angular/common/http";
import { environment } from 'src/environments/environment';
import { Injectable } from '@angular/core';

const apiURL = environment.apiURL;
@Injectable({
  providedIn: 'root'
})

export class PresupuestoService {
  constructor(private _http: HttpClient) { }

  postProductos(valor: any) {
    const header = new HttpHeaders();
    header.append("Content-Type", "applications/json");
    return this._http.post<any>(
      `${apiURL}presupuesto`, valor, { headers: header });
  }
}
