import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { FormControl } from '@angular/forms';
import { PaginatorEvent } from './models/page-event.model';

@Component({
  selector: 'paginator',

  templateUrl: './paginator.component.html',
  styleUrls: ['./paginator.component.scss'],
})
export class PaginatorComponent implements OnInit, OnChanges {
  totPages: number = 0;
  pages: number[] = [];
  pageSizeControl: FormControl = new FormControl(0);

  pageIndex: number = 0;
  length: number;
  maxSize: number;

  @Input() rotate: boolean;

  @Input() ellipses: boolean;

  @Input() pageSizeOptions: number[];

  @Input() set pageOptions(pageOptions: {
    pageIndex: number;
    listLength: number;
  }) {
    this.pageIndex = pageOptions.pageIndex;
    this.length = pageOptions.listLength;
  }

  @Input() pageSize: number = 0;

  @Output() onPageChange = new EventEmitter<PaginatorEvent>();

  constructor() {
    this.rotate = true;
    this.ellipses = false;
    this.maxSize = 4;
  }

  ngOnInit(): void {
    this.controlValueChanges();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['pageOptions']) {
      this._updatePages(this.pageIndex);
      this.pageSizeControl.setValue(this.pageSize, { emitEvent: false });
    }
  }

  getValueInRange(value: number, max: number, min: number = 0): number {
    return Math.max(Math.min(value, max), min);
  }

  _setPageInRange(newPageNo) {
    const prevPageNo = this.pageIndex;
    this.pageIndex = this.getValueInRange(newPageNo, this.totPages, 1);
    if (this.pageIndex !== prevPageNo) {
      const pageEvent: PaginatorEvent = new PaginatorEvent();
      pageEvent.pageIndex = this.pageIndex;
      pageEvent.pageSize = this.pageSize;
      pageEvent.length = this.length;
    }
  }

  private _applyPagination(): [number, number] {
    let page = Math.ceil(this.pageIndex / this.maxSize) - 1;
    let start = page * this.maxSize;
    let end = start + this.maxSize;

    return [start, end];
  }

  _applyRotation(): [number, number] {
    let start = 0;
    let end = this.totPages;
    let leftOffset = Math.floor(this.maxSize / 2);
    let rightOffset = this.maxSize % 2 === 0 ? leftOffset - 1 : leftOffset;

    if (this.pageIndex <= leftOffset) {
      // very beginning, no rotation -> [0..maxSize]
      end = this.maxSize;
    } else if (this.totPages - this.pageIndex < leftOffset) {
      // very end, no rotation -> [len-maxSize..len]
      start = this.totPages - this.maxSize;
    } else {
      // rotate
      start = this.pageIndex - leftOffset - 1;
      end = this.pageIndex + rightOffset;
    }

    return [start, end];
  }

  private _applyEllipses(start: number, end: number) {
    if (this.ellipses) {
      if (start > 0) {
        // The first page will always be included. If the displayed range
        // starts after the third page, then add ellipsis. But if the range
        // starts on the third page, then add the second page instead of
        // an ellipsis, because the ellipsis would only hide a single page.
        if (start > 2) {
          this.pages.unshift(-1);
        } else if (start === 2) {
          this.pages.unshift(2);
        }
        this.pages.unshift(1);
      }

      if (end < this.totPages) {
        // The last page will always be included. If the displayed range
        // ends before the third-last page, then add ellipsis. But if the range
        // ends on third-last page, then add the second-last page instead of
        // an ellipsis, because the ellipsis would only hide a single page.
        if (end < this.totPages - 2) {
          this.pages.push(-1);
        } else if (end === this.totPages - 2) {
          this.pages.push(this.totPages - 1);
        }
        this.pages.push(this.totPages);
      }
    }
  }

  _updatePages(newPage) {
    this.totPages = Math.ceil(this.length / this.pageSize);

    this.pages.length = 0;
    for (var i = 1; i <= this.totPages; i++) {
      this.pages.push(i);
    }

    this._setPageInRange(newPage);

    if (this.maxSize > 0 && this.totPages > this.maxSize) {
      let start = 0;
      let end = this.totPages;

      // either paginating or rotating page numbers
      if (this.rotate) {
        [start, end] = this._applyRotation();
      } else {
        [start, end] = this._applyPagination();
      }

      this.pages = this.pages.slice(start, end);

      // adding ellipses
      this._applyEllipses(start, end);
    }
  }

  setIntialPageSize() {
    this.pageSizeControl.setValue(this.pageSize);
  }

  controlValueChanges() {
    this.pageSizeControl.valueChanges.subscribe((result) => {
      this.pageSize = result;
      this.pageIndex = 0;
      this._updatePages(this.pageIndex);
    });
  }

  selectPage(pageNumber: number): void {
    this._updatePages(pageNumber);
    this.pageChange();
  }

  pageChange() {
    const pageEvent: PaginatorEvent = new PaginatorEvent();
    pageEvent.pageIndex = this.pageIndex;
    pageEvent.pageSize = this.pageSize;
    pageEvent.length = this.length;

    this.onPageChange.emit(pageEvent);
  }
}
