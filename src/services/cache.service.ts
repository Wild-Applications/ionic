import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs';


@Injectable()
export class CacheService {


  cache: any = {};

  constructor( private http: Http ){
  }

  get(id: string){
    return this.cache[id];
  }

  put(id: string, contents: any){
    this.cache[id] = contents;
  }
}
