import { Injectable } from '@angular/core';
import {formatDate,DatePipe} from '@angular/common';
import {CLIENTES} from './clientes.json';
import {Cliente} from './cliente';
//import {Observable} from 'rxjs/Observable';
import { Observable } from 'rxjs';
//import { of } from 'rxjs/observable/of';
import {of,observable,throwError} from 'rxjs';
import {HttpClient,  HttpHeaders} from '@angular/common/http';
import {map, catchError,tap} from 'rxjs/operators';
import swal from 'sweetalert2';
import {Router} from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class ClienteService {
//  private urlEndPonit:string = 'http://localhost:8080/api/clientes';
private urlEndPonit:string = "http://localhost:8080/api/clientes";
private httpHeaders = new HttpHeaders({'Content-type': 'application/json'})
  constructor(private http: HttpClient,private router: Router) { }

  getClientes(page: number): Observable<any> {
    //return of(CLIENTES);
  /*  return this.http.get<Cliente[]>(this.urlEndPonit);*/
    return this.http.get(this.urlEndPonit + '/page/' + page).pipe(
     tap( (response: any) => {
        console.log('ClienteService: tap 1');
        (response.content as Cliente[]).forEach(cliente =>{
          console.log(cliente.nombre);
        }
      )
    }),
      map((response:any)  => {
         (response.content as Cliente[]).map(cliente => {
           cliente.nombre = cliente.nombre.toUpperCase();
//          let datePipe = new DatePipe('es')
          //  cliente.createAt = datePipe.transform(cliente.createAt,'EEEE dd,MMMM yyyy')
  //        cliente.createAt = formatDate(cliente.createAt,'dd-MM-yyyy', 'en-US');
           return cliente;
         });
         return response;
      }
    ),
    tap(response =>{
      console.log('ClienteService: tap 2');
      (response.content as Cliente[]).forEach(cliente =>{
        console.log(cliente.nombre);
      }
    )
    })/*Cierrre del pipe*/
  );
  }

  create(cliente: Cliente): Observable<Cliente> {
    return this.http.post<any>(this.urlEndPonit,cliente,{headers: this.httpHeaders}).pipe(
      map( (response: any) => response.cliente as Cliente),
      catchError(e =>{
     if(e.status==400){
       return throwError(e);
     }
        console.error(e.error.mensaje);
        swal.fire(e.error.mensaje,e.error.error,'error');
        return throwError(e);
      })
    );
  }



  getCliente(id): Observable<Cliente>{
    return this.http.get<Cliente>(`${this.urlEndPonit}/${id}`).pipe(
      catchError(e => {
        this.router.navigate(['/clientes']);
        console.error(e.error.mensaje);
        swal.fire('Error al editar', e.error.mensaje, 'error');
        return throwError(e);
      })
    );
  }

  update(cliente: Cliente): Observable<any>{
    return this.http.put<any>(`${this.urlEndPonit}/${cliente.id}`, cliente, {headers:this.httpHeaders}).pipe(
      catchError(e =>{

        if(e.status==400){
          return throwError(e);
        }

        console.error(e.error.mensaje);
        swal.fire(e.error.mensaje,e.error.error,'error');
        return throwError(e);
      })
    );

  }


delete(id: number): Observable<Cliente>{
  return this.http.delete<Cliente>(`${this.urlEndPonit}/${id}`,{headers:this.httpHeaders}).pipe(
    catchError(e =>{
      console.error(e.error.mensaje);
      swal.fire(e.error.mensaje,e.error.error,'error');
      return throwError(e);
    })
  );
}




}
