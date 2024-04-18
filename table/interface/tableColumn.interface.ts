import { ProviderToken } from '@angular/core';

export interface Fields {
  name: string;
  dataKey?: string;
  isSortable?: boolean;
  pipe?: ProviderToken<any>;
  pipeArgs?: string[];
  objectKey?: string;
  isContent?: boolean;
  classCustom?: Function;
  styleCustom?: any;
  noBreakLine?: boolean;
}
