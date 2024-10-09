import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'searchFilter'
})
export class SearchFilterPipe implements PipeTransform {

  transform(items: any[], searchText: string): any[] {
    if (!items || !searchText) {
      return items;
    }

    searchText = searchText.toLowerCase();

    return items.filter(item => {
      const filteredHitGenerated = item.hit_generated.find(hitObj => hitObj.name.toLowerCase().indexOf(searchText) === 0);
      return filteredHitGenerated !== undefined;
    }).map(item => {
      return {
        ...item,
        hit_generated: item.hit_generated.filter(hitObj => hitObj.name.toLowerCase().indexOf(searchText) === 0)
      };
    });

  }

}
