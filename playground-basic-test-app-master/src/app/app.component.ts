import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ApiService } from '../app/services/api-service.service';
import { Patient } from './patient.model';
import { MAT_DATE_LOCALE, MAT_DATE_FORMATS, DateAdapter, MatTableDataSource, MatSort } from '@angular/material';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent implements OnInit {
  title = 'fhir-app-test';
  page = 'Patient Search';
  showResult = false;
  dataLoadSpinner = false;
  dataSource: MatTableDataSource<Patient>;
  totalRecords = 0;
  displayedColumns: string[] = [
    'resource.id',
    'fullUrl',
    'resource.resourceType',
    'resource.birthDate',
    'resource.gender'
  ]

  constructor(
    private apiService: ApiService,
    private changeDetector: ChangeDetectorRef,
  ) { }
  
  @ViewChild('form') form;
  //@ViewChild(CustomPaginatorComponent) paginator: CustomPaginatorComponent;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('tableContainer') tableContainer: ElementRef;
  
  ngOnInit() {
    this.showResult = false;
    this.apiService.getPatients().subscribe(
      data => {
        this.dataSource = new MatTableDataSource(data.entry);
        this.totalRecords = data.length;
        this.showResult= true;
      }
    )
  }

  
  dataTableSort(): void {
    this.changeDetector.detectChanges();
    this.dataSource.sortingDataAccessor = (obj, property) => (
      property.split('.').reduce((o, p) => o &&
        ((o[p] !== null && typeof o[p] === 'string') ? o[p].toLocaleLowerCase().trim() : o[p]), obj)
    );

    this.dataSource.sortData = (data: any, sort: MatSort): any => {
      const active = sort.active;
      const direction = sort.direction;
      if (!active || direction === '') { return data; }
      return data.sort((a, b) => {
        const valueA = this.dataSource.sortingDataAccessor(a, active) as string;
        const valueB = this.dataSource.sortingDataAccessor(b, active) as string;
        let comparatorResult = 0;
        if (valueA != null && valueB != null) {
          if (typeof valueA === 'string' && typeof valueB === 'string') {
            comparatorResult = valueA.localeCompare(valueB, 'en', { numeric: true });
          } else {
            // Check if one value is greater than the other; if equal, comparatorResult should remain 0.
            if (valueA > valueB) {
              comparatorResult = 1;
            } else if (valueA < valueB) {
              comparatorResult = -1;
            }
          }
        } else if (valueA != null) {
          comparatorResult = 1;
        } else if (valueB != null) {
          comparatorResult = -1;
        }
        return comparatorResult * (direction === 'asc' ? 1 : -1);
      });
    };
    this.dataSource.sort = this.sort;
    //this.dataSource.paginator = this.paginator;
    this.dataSource.paginator.firstPage();
  }

  
}
