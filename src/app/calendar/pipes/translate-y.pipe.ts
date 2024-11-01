import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'translateY',
  standalone: true
})
export class TranslateYPipe implements PipeTransform {

  transform(startPosition: number): string {
    return `top: ${startPosition + 30}px; position: absolute; width: 93%`;
  }

}
