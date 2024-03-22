import { Directive, ElementRef, HostListener, Input, Renderer2 } from '@angular/core';

@Directive({
  selector: '[appHighlightCard]',
  standalone: true
})
export class HighlightCardDirective {
  @Input() defaultColor: string = '';//@input property decoraator
  @Input() appHighlightCard: string = '';

  constructor(private el: ElementRef, private renderer: Renderer2) {}

  ngOnInit() {
    this.renderer.setStyle(this.el.nativeElement, 'background-color', this.defaultColor || 'transparent');
  }

  @HostListener('mouseenter') onMouseEnter() {//event decorator @HostListener
    this.highlight(this.appHighlightCard || 'rgba(0,0,0,0.1)');
    this.renderer.setStyle(this.el.nativeElement, 'box-shadow', '0px 4px 8px rgba(0,0,0,0.2)');
  }

  @HostListener('mouseleave') onMouseLeave() {
    this.renderer.setStyle(this.el.nativeElement, 'background-color', this.defaultColor || 'transparent');
    this.renderer.setStyle(this.el.nativeElement, 'box-shadow', 'none');
  }

  private highlight(color: string) {
    this.renderer.setStyle(this.el.nativeElement, 'background-color', color);
  }
}
