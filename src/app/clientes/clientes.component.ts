import { Component, OnInit } from '@angular/core';
import { Cliente } from './cliente';
import {ClienteService} from './cliente.service';
import swal from 'sweetalert2';
import {tap} from 'rxjs/operators';
import {ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-clientes',
  templateUrl: './clientes.component.html'
})
export class ClientesComponent implements OnInit {

  clientes: Cliente[];
  paginador: any;

  constructor(private clienteService: ClienteService,
  private activatedRoute: ActivatedRoute) { }

  ngOnInit(){

    this.activatedRoute.paramMap.subscribe( params => {
      let page:number = +params.get('page');

      if(!page){
        page = 0;
      }
    this.clienteService.getClientes(page)
    .pipe(
      tap(response => {
        console.log('ClientesComponent: tap 3');
        (response.content as Cliente[]).forEach(cliente => {
          console.log(cliente.nombre);
        });
      })
    ).subscribe(response => {
      this.clientes = response.content as Cliente[];
      this.paginador = response;
    });
  }
  );
  }

  delete(cliente: Cliente): void{
const swalWithBootstrapButtons = swal.mixin({
  customClass: {
    confirmButton: 'btn btn-success',
    cancelButton: 'btn btn-danger'
  },
  buttonsStyling: false
})
swalWithBootstrapButtons.fire({
  title: 'Estas Seguro?',
  text: `¿Seguro que deseas eliminar el registro ${cliente.nombre} ${cliente.apellido}?`,
  icon: 'warning',
  showCancelButton: true,
  confirmButtonText: 'Yes, Eliminar!',
  cancelButtonText: 'No, Cancelar!',
  reverseButtons: true
}).then((result) => {
  if (result.value) {
    this.clienteService.delete(cliente.id).subscribe(
      response => {
        this.clientes = this.clientes.filter(cli => cli !== cliente)
        swalWithBootstrapButtons.fire(
          'Registro Eliminado!',
          `Registro ${cliente.nombre} Eliminado Correctamente.`,
          'success'
        )
      }
    )

  }
})
  }

}
