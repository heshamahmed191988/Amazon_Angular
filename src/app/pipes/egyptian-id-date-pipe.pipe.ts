import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'egyptianIdDate',
  standalone: true
})
export class EgyptianIdDatePipe implements PipeTransform {

  transform(idNumber: string, datePart: string): string {
    // Extracting the birth date components from the ID using `slice`
    const century = idNumber.startsWith('2') ? 1900 : 2000;
    const year = century + parseInt(idNumber.slice(1, 3), 10); // Changed from substr to slice
    const month = idNumber.slice(3, 5); // Changed from substr to slice
    const day = idNumber.slice(5, 7); // Changed from substr to slice

    switch (datePart) {
      case 'YY':
        return `${year}`;
      case 'MM':
        return `${month}`;
      case 'DD':
        return `${day}`;
      case 'FullDate':
        return `${day}-${month}-${year}`;
      default:
        return 'Invalid Date Part';
    }
  }
}
