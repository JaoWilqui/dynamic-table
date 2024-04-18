import { Directive, Input, TemplateRef } from '@angular/core';

@Directive({
  selector: '[tableCustomColumn]',
})
export class TableCustomColumnDirective {
  @Input() field: string;
  constructor(public templateRef: TemplateRef<any>) {}
}
