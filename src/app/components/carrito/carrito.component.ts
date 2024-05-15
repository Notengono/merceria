import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, NgModel } from '@angular/forms';
import { jsPDF } from "jspdf";
import { PresupuestoService } from 'src/app/services/presupuesto.service';

@Component({
    selector: 'app-carrito',
    templateUrl: './carrito.component.html',
    styleUrls: ['./carrito.component.css']
})
export class CarritoComponent implements OnInit {
    fecha = ''
    estado = 3

    carrito: any[] = [];
    precioTotal = 0
    enCarrito = 0
    precioForm = this.fb.group({
        codigo: 10002,
        grupo: 17,
        subgrupo: 10002,
        producto: 'Varios',
        idproducto: 41,
        precio: 0,
        cantidad: 1,
    })

    modalDescuento = false
    numero = 0
    precioTotalD = 0
    descuento = 0
    cantidad = 1
    precio = 0
    precioTotalModal = 0

    constructor(private fb: FormBuilder, private _presupuestoService: PresupuestoService) { }

    ngOnInit(): void {
        const aux_ = new Date();
        const aux1_ = ((aux_.getMonth() + 1) > 9) ? (aux_.getMonth() + 1) : '0' + (aux_.getMonth() + 1);
        const aux2_ = ((aux_.getUTCDate() + 1) > 9) ? aux_.getUTCDate() : '0' + aux_.getUTCDate();
        this.fecha = aux_.getFullYear() + '-' + aux1_ + '-' + aux2_;

        this.carrito = JSON.parse(localStorage.getItem('carrito') || '[{}]');
        this.contarCarrito()

        this._presupuestoService.numeroPresupuesto().subscribe(resultado => { this.numero = resultado.datos.numero })
    }

    contarCarrito() {
        this.precioTotal = 0
        this.enCarrito = Array.isArray(this.carrito) ? this.carrito.length : 0
        if (this.enCarrito > 0) {
            for (let item of this.carrito) {
                this.precioTotal += parseFloat(item.precio)
            }
            this.precioTotal = this.precioTotal * (1 - (this.descuento / 100))
        }
    }

    finCarrito() {
        this._presupuestoService
            .postProductos({ fecha: this.fecha, numero: this.numero, estado: this.estado, fechaFin: this.fecha, productos: this.carrito })
            .subscribe(respuesta => console.log(respuesta))
        this.cancelarCompra()
    }

    finPresupuesto() {
        // Va sin fecha de finalización.
        this._presupuestoService
            .postProductosPresupuesto({ fecha: this.fecha, numero: this.numero, estado: this.estado, productos: this.carrito })
            .subscribe(respuesta => console.log(respuesta))
        // this.cancelarCompra()
    }

    imprimirTiket() {
        const doc = new jsPDF("p", "mm", [57, 100]);
        doc.setFontSize(12);
        doc.text('X', 28, 5, { align: 'center' });
        doc.text("Mercería Angel Andrés", 28, 10, { align: 'center' });
        // doc.text("Ministerio de Salud", 28, 10, { align: 'center' });

        let linea = 15
        doc.setFontSize(6);
        doc.text(this.fecha, 54, 5, { align: 'right' });

        for (let item of this.carrito) {
            doc.text(item.descripcion, 3, linea);
            linea += 3
            doc.text('$ ' + item.precioIndividual.toString() + ' * ' + item.caintidad.toString(), 5, linea);
            doc.text('$ ' + item.precio.toString(), 54, linea, { align: 'right' });
            linea += 4
        }

        doc.line(0, 12, 57, 12, 'D')
        doc.line(0, 91, 57, 91, 'D')
        doc.setFontSize(8);
        doc.setFont('', 'bold')
        doc.text('Total: $ ' + this.precioTotal.toString(), 54, 95, { align: 'right' })

        doc.output('dataurlnewwindow');
    }

    imprimirCarrito() {
        const doc = new jsPDF();
        // const doc = new jsPDF('portrait', 'mm', 'a4');
        doc.setProperties({
            title: "Presupuesto_Merceria_Angel_Andres",
            creator: 'Merceria Angel Andres.',
            author: 'Merceria Angel Andres.'
        })

        doc.text("Angel Andrés", 20, 20);

        doc.setLineWidth(0.5);
        doc.line(30, 45, 30, 245, 'D')
        doc.line(145, 45, 145, 245, 'D')
        doc.line(167, 45, 167, 245, 'D')
        doc.line(15, 235, 195, 235, 'D')
        doc.rect(15, 45, 180, 200, 'D')
        doc.rect(15, 10, 180, 35, 'D')
        doc.rect(100, 10, 10, 10, 'D')
        doc.line(105, 20, 105, 45, 'D')
        let linea = 50
        doc.setFontSize(20);
        doc.text('X', 103, 17);
        doc.setFontSize(10);
        doc.text('0001-000000001', 160, 20);

        for (let item of this.carrito) {
            doc.text(item.descripcion, 31, linea);
            doc.text('$ ' + item.precioIndividual.toString(), 146, linea);
            doc.text(item.caintidad.toString(), 21, linea);
            doc.text('$ ' + item.precio.toString(), 168, linea);
            linea += 5
        }
        doc.text('$ ' + this.precioTotal.toString(), 168, 241)
        doc.output('dataurlnewwindow', { filename: "Presupuesto Merceria Angel Andres" });
    }

    quitarItem(indice: any) {
        this.carrito.splice(indice, 1)
        localStorage.setItem('carrito', JSON.stringify(this.carrito))
        this.contarCarrito()
    }

    cancelarCompra() {
        localStorage.removeItem('carrito')
        this.carrito = []
        this.precioTotal = 0
        this.enCarrito = 0
    }

    modal(valor: string) {
        this.modalDescuento = valor == 'p' ? false : true
    }

    agregarProducto = () => {
        this.carrito.push({ id: 17, 'descripcion': "Varios", 'precio': this.precioTotalModal, 'precioIndividual': this.precio, 'caintidad': this.cantidad });
        localStorage.setItem('carrito', JSON.stringify(this.carrito))
        this.contarCarrito()
    }

    controlarKeyUp(op: string) {
        switch (op) {
            case 'pi':
                this.precioTotalModal = parseFloat((this.precio * this.cantidad).toFixed(2))
                break;
            case 'pt':
                this.precio = parseFloat((this.precioTotalModal / this.cantidad).toFixed(2))
                break;
            case 'de':
                this.precioTotalD = parseFloat((this.precioTotal * (1 - this.descuento / 100)).toFixed(2))
                break;
            default:
                this.precioTotalModal = parseFloat((this.precio * this.cantidad).toFixed(2))
                break;
        }
    }
}
