import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {MdlArticulo} from "../../pages/model/mdl-articulo";
import {ResponseGetArticulo} from "../../pages/response/response-get-articulo";
import {ResponseList} from "../../pages/response/responseList";
import {environment} from "../../app/enviroment";
import {TokenProvider} from "../token/token";

/*
  Generated class for the SicServiceProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class SicServiceProvider {
  headers: HttpHeaders;
  url: string;
  valor: string;
  jsonNew: string;
  constructor(private http: HttpClient, public tokenService:TokenProvider) {
    this.url = environment.url;
  }
  getGlobal<Object>(url:string){
    if(this.tokenService.get() && this.tokenService.get().token){
      return this.http.get<Object>(this.url + url,{
        headers: new HttpHeaders().set('token', this.tokenService.get().token).set('Content-Type','application/json'),
      });
    }else {
      return this.http.get<Object>(this.url + url);
    }
  }
  postGlobal<Object>(objeto: any, url:string) {
    this.valor = JSON.stringify(objeto);
    if (this.tokenService.get() && this.tokenService.get().token) {
      return this.http.post<Object>(this.url + url, this.valor, {
        headers: new HttpHeaders().set('token', this.tokenService.get().token).set('Content-Type', 'application/json'),
      });
    } else{
      return this.http.post<Object>(this.url + url, this.valor, {
        headers: new HttpHeaders().set('Content-Type', 'application/json'),
      });
    }
  }
  deleteGlobal<Object>(codigo:string, url :string){
    if (this.tokenService.get() && this.tokenService.get().token) {
      return this.http.delete<Object>(this.url + url + codigo, {
        headers: new HttpHeaders().set('token', this.tokenService.get().token).set('Content-Type', 'application/json'),
      });
    }else {
      return this.http.delete<Object>(this.url + url + codigo, {
        headers: new HttpHeaders().set('Content-Type', 'application/json'),
      });
    }
  }
  putGlobal<Object>(objeto:any, url: string, id: string){
    this.valor = JSON.stringify(objeto);
    if (this.tokenService.get() && this.tokenService.get().token) {
      return this.http.put<Object>(this.url + url + id, this.valor, {
        headers: new HttpHeaders().set('token', this.tokenService.get().token).set('Content-Type', 'application/json'),
      });
    }else{
      return this.http.put<Object>(this.url + url + id, this.valor, {
        headers: new HttpHeaders().set('Content-Type', 'application/json'),
      });
    }
  }
}
