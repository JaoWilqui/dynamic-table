import { Pipe, PipeTransform, TemplateRef } from '@angular/core';

@Pipe({
  name: 'fieldFilter',
})
export class FieldFilterPipe implements PipeTransform {
  transform(
    customColumns: TemplateRef<any>[],
    nameColumn?: string
  ): TemplateRef<any>[] {
    return customColumns.filter((customColumn) => {
      return customColumn['field'] === nameColumn;
    });
  }
}
