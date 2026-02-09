import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filterByCategory',
  standalone: true   // 🔥 MUST add
})
export class FilterByCategoryPipe implements PipeTransform {

  transform(list: any[], type: string): any[] {
    return list?.filter(item => item.category_type === type) || [];
  }

}
