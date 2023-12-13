import { Component, OnInit } from '@angular/core';
import { CategoriasService } from 'src/app/services/categorias.service';

@Component({
  selector: 'app-grupos',
  templateUrl: './grupos.component.html',
  styleUrls: ['./grupos.component.css']
})
export class GruposComponent implements OnInit {

  constructor(private _categorias: CategoriasService) { }

  ngOnInit(): void {
  }

}
