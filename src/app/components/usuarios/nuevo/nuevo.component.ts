import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-nuevo',
  templateUrl: './nuevo.component.html',
  styleUrls: ['./nuevo.component.css']
})
export class NuevoComponent implements OnInit {

  usuarioForm = this.fb.group({
    nombre: '',
    userName: '',
    userPass: '',
    user_baja: 0,
    intentos: 0
  })

  constructor(private fb: FormBuilder) { }

  ngOnInit(): void {
  }

}
