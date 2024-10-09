import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name:'textFilter'
})

export class CustomTextFilter implements PipeTransform{
    transform(items:any,filter:any):any{
        
        if (!items || !filter) {
            return items;
        }
        return items.filter(function search(row) { // name the function so we can use recursion (thus we can't use an arrow function)
            return Object.keys(row).some((key) => { //
                if(typeof row[key] === "string") { // if the current property is a string
                    return row[key].toLowerCase().indexOf(filter.toLowerCase()) > -1; // then check if it contains the search string
                } else if(row[key] && typeof row[key] === "object") { // oterwise, if it's an object
                    return search(row[key]); // do a recursive check
                }
            return false; // return false for any other type (not really necessary as undefined will be returned implicitly)
            });
      });
    }
}