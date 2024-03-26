import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'safeBase64',
  standalone: true
})
export class SafeBase64Pipe implements PipeTransform {
  transform(value: unknown): string {
    // Check if the value is indeed a string, which is expected for base64 encoded data
    if (typeof value === 'string' && value.trim() !== '') {
      // If it is a string, prepend the data URI scheme required for base64 encoded images
      return `data:image/jpg;base64,${value}`;
    }
    // If the input value is not a string or is empty, return an empty string to avoid errors
    return '';
  }
}
