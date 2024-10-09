import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'getValueByRefKey'
})
export class GetValueByRefKeyPipe implements PipeTransform {

  transform(value: any, obj:Array<any>, refKey,returningKey): any {
    let val = null;
    obj.forEach((element)=>{
      if(element && refKey && value && returningKey && element[refKey] == value){
        val  = element[returningKey] ? element[returningKey].toString() : null;
        return;
      }
    })
    return val;
  }

}
