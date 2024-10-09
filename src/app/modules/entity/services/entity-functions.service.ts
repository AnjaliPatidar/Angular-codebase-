import { Injectable } from '@angular/core';
import { ActivatedRoute } from '@angular/router'

@Injectable()
export class EntityFunctionService {

  constructor( private activatedRoute: ActivatedRoute) { }
  getParams(){
    let queryParams:any = {query:null,qId:null,caseId:null,eId:null,cId:null};
    this.activatedRoute.queryParamMap
    .subscribe(params => {
       queryParams['query'] = params.get('query') || null;
       queryParams['qId'] = params.get('qId') || null
       queryParams['caseId'] = params.get('caseId') || null
       queryParams['eId'] = params.get('eId') || null
       queryParams['cId'] = params.get('cId') || null
    });
    
    
    
    return queryParams;
  }
  
}
