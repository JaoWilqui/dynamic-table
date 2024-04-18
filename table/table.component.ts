import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ContentChild,
  ContentChildren,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  QueryList,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { MatSort, Sort } from '@angular/material/sort';
import { PaginatorEvent } from '../paginator/models/page-event.model';

import { DatePipe } from '@angular/common';
import {
  CgcPipe,
  FirstLetterPipe,
  NumberPipe,
  PhonePipe,
  PlatePipe,
} from 'src/app/shared/pipes';
import { DateBrPipe } from 'src/app/shared/pipes/datebr.pipe';
import { PaginatorComponent } from '../paginator/paginator.component';
import { TableCustomColumnDirective } from './directives/table-custom-column.directive';
import { SortInterface } from './interface/sort.model';
import { DynamicPipe } from './pipes/dynamic.pipe';
import { FieldFilterPipe } from './pipes/field-filter.pipe';

@Component({
  selector: 'app-table',
  providers: [
    DatePipe,
    CgcPipe,
    FirstLetterPipe,
    DatePipe,
    NumberPipe,
    PhonePipe,
    PlatePipe,
    DynamicPipe,
    FieldFilterPipe,
    DateBrPipe,
  ],
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss'],
})
export class TableComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild(MatSort, { static: true }) matSort: MatSort;

  @ViewChild('paginator') paginator: PaginatorComponent;
  @ContentChildren(TableCustomColumnDirective) customColumns: QueryList<
    TemplateRef<{}>
  >;
  @ContentChild('actions') actionTemplate: TemplateRef<any>;

  @Input('container') container?: HTMLElement;

  appContainer: HTMLElement;

  @Input() pageOptions: { pageIndex: number; listLength: number };
  @Input() pageSizeOptions: number[] = [5, 10, 15, 20];
  @Input() pageSize: number = this.pageSizeOptions[1];
  @Input() listLength: number;
  @Input() isPageable = false;

  @Input() isLoading: boolean;
  @Input() options: string = null;
  @Input() haveSelectRow: { bgColor: string; selectKey?: string } = null;

  @Output() selectData = new EventEmitter<number>();
  @Output() sortData = new EventEmitter<SortInterface>();
  @Output() changePageData = new EventEmitter<PaginatorEvent>();

  displayedColumns: string[] = [];
  @Input() tableData: any[];
  @Input() tableColumns: any[] = [];

  @Input() minWidth: string = '700px';

  constructor(private cd: ChangeDetectorRef) {}
  ngAfterViewInit(): void {}

  ngOnInit() {}

  getValue(row: any, dataKey: any, objectKey: any) {
    let obj: {} = row;
    let value: string;
    let objValue: {};
    if (objectKey) {
      Object.keys(obj).forEach((key) => {
        if (key === dataKey) {
          objValue = obj[key];
          if (objValue === null) {
            return;
          }
          value = objValue[objectKey];
        }
      });
      return value;
    }
    Object.keys(obj).forEach((key) => {
      if (key === dataKey) {
        value = obj[key];
      }
    });
    return value;
  }

  sortTable(sortEvent: Sort) {
    this.sortData.emit({
      orderBy: sortEvent.active,
      orderDirection: sortEvent.direction.toUpperCase(),
    });
  }

  updateTableData(data: any[]) {
    this.tableData = data;
    this.cd.markForCheck();
  }

  pageChange(event: PaginatorEvent) {
    this.changePageData.emit(event);
  }

  selectElement(element: any) {
    if (this.haveSelectRow) {
      this.selectData.emit(element);
    }
  }

  ngOnDestroy(): void {}
}
