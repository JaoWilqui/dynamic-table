import { Injector, Pipe, PipeTransform, ProviderToken } from '@angular/core';

@Pipe({
  name: 'dynamicPipe',
})
export class DynamicPipe implements PipeTransform {
  public constructor(private injector: Injector) {}

  transform(
    value: any,
    pipeToken: ProviderToken<any>,
    pipeArgs: any[] = []
  ): any {
    if (!pipeToken) {
      return value;
    } else {
      let pipe = this.injector.get(pipeToken);
      return pipe.transform(value, ...pipeArgs);
    }
  }
}
