import { Injectable, EventEmitter, Output } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs';


@Injectable()
export class CacheService {


  cache: any = {};

  table: any;
  public tableChange: Subject<boolean> = new Subject<boolean>();

  constructor( private http: Http ){
  }

  get(id: string){
    return this.cache[id];
  }

  put(id: string, contents: any){
    this.cache[id] = contents;
    if(id == "table"){
      this.setTable(contents);
    }
  }

  setTable(table){
    this.table = table;
    if(this.table){
      this.tableChange.next(true);
    }else{
      this.tableChange.next(false);
    }
  }
}
