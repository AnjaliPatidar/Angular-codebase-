import { Pipe, PipeTransform } from '@angular/core';
@Pipe({
  name: 'getPermissionId'
})
export class GetPermissionIdPipe implements PipeTransform {

  transform(value: Array<any>, arg:any): Object {

    let result: Object;
    if (typeof arg == 'string') {
      if (value && value.length > 0) {
        result = value.find(ele => ele.hasOwnProperty(arg));
      }
      if (result) {
        return result[arg];
      }
    }

    if(typeof arg=='string' && arg.includes(' ')){
    arg=  arg.split(' ');
    arg[0]=arg[0].toLowerCase();
   arg = arg.join('');
    }
    else {
     arg= arg.toLowerCase()
    }
    if(value && value.length > 0) {
      result=  value.find(ele=>ele.hasOwnProperty(arg));
    }
    result =result ? result[arg] : {};
    return result;
  }

}
