import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'calculateHeight',
  standalone: true
})
export class CalculateHeightPipe implements PipeTransform {

  transform(value: number): string {
    return value + 'px' ;
  }

}
