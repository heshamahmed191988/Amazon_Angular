import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'formatCreditCard',
  standalone: true
})
export class FormatCreditCardPipe implements PipeTransform {

  transform(value: string): string {
    // Remove non-numeric characters just in case
    const numericValue = value.replace(/\D/g, '');

    // Format the string in groups of 4 digits separated by a dash
    return numericValue.replace(/(\d{4})(?=\d)/g, '$1 - ');
  }
}
