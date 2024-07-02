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
    hora = ''

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
        this.hora = aux_.getHours().toString() +':'+aux_.getMinutes().toString();
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
        this.cancelarCompra()
    }

    imprimirTiket() {
        const alto = (this.carrito.length * 7) + 30
        const doc = new jsPDF("p", "mm", [49, alto]);
        doc.setFont('Courier', 'Bold');
        doc.setFontSize(7);
        doc.text('TICKET NO VALIDO COMO FACTURA', 24, 5, { align: 'center' });
        doc.setFontSize(10);
        doc.text("Mercería Ángel Andrés", 24, 10, { align: 'center' });
        // doc.text("Ministerio de Salud", 24, 10, { align: 'center' });

        const fecha_ = this.fecha.split('-')
        let linea = 20
        doc.setFontSize(7);
        doc.text('fecha: ' + fecha_[2] + '/' + fecha_[1] + '/' + fecha_[0] + ' ' + this.hora, 47, 15, { align: 'right' });

        for (let item of this.carrito) {
            doc.text(item.descripcion.substring(0, 31), 1, linea);
            linea += 3
            doc.text('$ ' + item.precioIndividual.toString() + ' * ' + item.caintidad.toString(), 5, linea);
            doc.text('$ ' + item.precio.toString(), 47, linea, { align: 'right' });
            linea += 4
        }

        // doc.setLineDash([10, 10], 0);
        doc.setLineDashPattern([1.5, 1], 0);
        doc.line(0, 12, 49, 12, 'D')
        doc.line(0, (alto - 10), 49, (alto - 10), 'D')
        doc.setFontSize(8);
        doc.setFont('', 'bold')
        doc.text('Total: $ ' + this.precioTotal.toString(), 47, (alto - 6), { align: 'right' })

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
        doc.setFontSize(18);
        doc.text('TICKET NO VALIDO COMO FACTURA', 1, 17, { align: 'center' });
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
        const descripcion = this.carrito[indice].descripcion
        this.carrito.splice(indice, 1)
        localStorage.setItem('carrito', JSON.stringify(this.carrito))
        this.contarCarrito()
        this.appendAlert(`Se quitó el producto ${descripcion}`, 'warning')
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
        this.appendAlert(`Producto VARIOS, cantidad: ${this.cantidad} y precio $${this.precio} agregado.`, 'success')
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

    appendAlert(mensaje: string, estado: any) {
        const wrapper = document.createElement('div')
        wrapper.innerHTML = [
            `<div class="alert alert-${estado} alert-dismissible" role="alert">`,
            `   <div>${mensaje}</div>`,
            '   <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>',
            '</div>'
        ].join('')

        document.getElementById('liveAlertPlaceholder')?.append(wrapper)
        setTimeout(() => {
            document.getElementById('liveAlertPlaceholder')?.remove()
        }, 3000);
    }
}
