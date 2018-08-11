import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
import {ResponseLogin} from "../../pages/response/response-login";
import {Subject} from "rxjs/Subject";
import {Observable} from "rxjs/Observable";

/*
  Generated class for the TokenProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class TokenProvider {
  private token:ResponseLogin;
  private subject = new Subject<any>();

  constructor() {
    console.log('Hello TokenProvider Provider');
  }
  get():ResponseLogin{
    return this.token;
  }
  set(token:ResponseLogin){
    this.token = token;
  }
  setData(data:any){
    this.subject.next(data);
  }
  getData<ResponseLogin>():Observable<any> {
    return this.subject.asObservable();
  }

}
