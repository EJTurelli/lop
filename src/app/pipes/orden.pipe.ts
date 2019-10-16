import { Pipe, PipeTransform } from '@angular/core';
import { UserLop } from '../interfaces/userLop';

@Pipe({
  name: 'orden'
})
export class OrdenPipe implements PipeTransform {

  transform(value: UserLop[] ): UserLop[] {

    return value.sort( (a, b) => (a.lastDateSelected > b.lastDateSelected) ? 1 : -1 );
  }

}
