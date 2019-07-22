import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Column } from 'src/app/shared/model/column.model';
import { TestService } from 'src/app/core/services/crud/test.service';
import { SystemService } from 'src/app/core/services/crud/system.service';

@Component({
  selector: 'app-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.scss']
})
export class FilterComponent implements OnInit {
  dataList: any;
  @Input() field: any;
  @Input() column: Column;
  @Output() applyFilterOutput = new EventEmitter<void>();
  data: any;
  model = [];
  searchItems = [];


  constructor(private testService: TestService, private systemService: SystemService) {  }

  applyFilter() {
    //console.log(this.model);
    
    this.column.sSearch = (this.column.param.multiple)? this.model : [this.model];
    this.applyFilterOutput.emit();
    
  }

  add(value) {
    this.column.sSearch.push(value);
  }

  change(values) {
    if (this.column.param.multiple) this.column.sSearch = values;
    else if (values!='') this.column.sSearch = [values];
    else this.column.sSearch = [];
  }

  dbg(smth) {
    this.model = this.column.sSearch;
    this.searchItems = [];
  }

  onKeyUpEnter(value) {
    this.model = this.searchItems;
    this.column.sSearch = this.searchItems;
  }

  ngOnInit() {
    if(this.column.type==='label'){
      this.systemService.getLabelsFromSystem('');
      this.systemService.observableLabelsList.subscribe(response => {
        if (response) {
          if (response.length > 0) {
            this.dataList = response;
          }
        } else {
          this.dataList = null;
        }
      });

    } else {
      this.testService.getColumnData(this.column.databaseName).subscribe(response => {
        if (response) {
          if (response.distinctValues.length > 0) {
            this.dataList = response.distinctValues;       
          }
        } else {
          this.dataList = null;
        }
      });
    }
    
  }
  onSelectAll() {
    let selectedElements = (this.searchItems.length>0)? this.searchItems : this.dataList;
    this.model = selectedElements;
    this.column.sSearch = selectedElements;
  }
  onClearAll() {
    this.model = [];
    this.column.sSearch = [];
  }

  onSearch(event){
    this.searchItems = event.items;
    
  }

}
