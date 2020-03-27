import { PipeTransform, Pipe } from '@angular/core';

@Pipe({ name: 'toUpper '})
export class ToUpperPipe implements PipeTransform {
  transform( input: string ): string {
    return input.toUpperCase();
  }
}
