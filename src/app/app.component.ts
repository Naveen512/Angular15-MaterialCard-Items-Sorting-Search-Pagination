import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { PageEvent } from '@angular/material/paginator';
import { AppService } from './app.service';
import { Car } from './car';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  title = 'ang15-matcard-search-sort-page-demo';
  sortOrderControl = new FormControl('');
  searchKey = new FormControl('');
  cars: Car[] = [];
  totalRecords: number = 0;
  currentPageNumber = 1;
  pageSize = 1;
  constructor(private appService: AppService) {}

  ngOnInit(): void {
    this.getApi('', '', '',
    this.currentPageNumber,
    this.pageSize);
    this.sortOrderControl.valueChanges.subscribe((value) => {
      if (value) {
        let sortResult = this.doSorting(value);
        this.currentPageNumber = 1;
        this.pageSize = 1;
        this.getApi(sortResult.sortColumn, sortResult.sortType, '',
        this.currentPageNumber,
        this.pageSize);
      }
    });
  }

  doSorting(value: string) {
    let sortColumn: string = '';
    let sortType: string = '';
    if (value.toLowerCase() === 'id-by-desc') {
      sortColumn = 'id';
      sortType = 'desc';
    } else if (value.toLowerCase() === 'id-by-asc') {
      sortColumn = 'id';
      sortType = 'asc';
    } else if (value.toLowerCase() === 'year-by-desc') {
      sortColumn = 'year';
      sortType = 'desc';
    } else if (value.toLowerCase() === 'year-by-asc') {
      sortColumn = 'year';
      sortType = 'asc';
    } else if (value.toLowerCase() === 'color-by-desc') {
      sortColumn = 'color';
      sortType = 'desc';
    } else if (value.toLowerCase() === 'color-by-asc') {
      sortColumn = 'color';
      sortType = 'asc';
    }
    return {
      sortColumn,
      sortType,
    };
  }

  searchByName() {
    let sortResult = this.doSorting(this.sortOrderControl.value ?? '');
    this.currentPageNumber = 1;
    this.pageSize = 1;
    this.getApi(
      sortResult.sortColumn,
      sortResult.sortType,
      this.searchKey.value ?? '',
      this.currentPageNumber,
      this.pageSize
    );
  }

  getApi(sortColumn: string, sortType: string, searchKey: string,
    currentPage:number, pageSize:number) {
    this.appService
      .get(sortColumn, sortType, searchKey,currentPage, pageSize)
      .subscribe((response) => {
        this.cars = response.body as Car[];
        this.totalRecords = response.headers.get('X-Total-Count')
          ? Number(response.headers.get('X-Total-Count'))
          : 0;
          console.log(this.totalRecords);
      });
  }

  handlePageEvent(e: PageEvent) {
    
    this.currentPageNumber = (e.pageIndex + 1);
    this.pageSize = e.pageSize;
    let sortResult = this.doSorting(this.sortOrderControl.value ?? '');
    this.getApi(
      sortResult.sortColumn,
      sortResult.sortType,
      this.searchKey.value ?? '',
      this.currentPageNumber,
      this.pageSize
    );
  }
}
