import { Component, OnInit } from '@angular/core';
import { ApiService } from '../app/services/api-service.service';
import * as moment from 'moment';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent implements OnInit {
  title = 'fhir-app-test';
  patientData:any = [];
  searchText = "";
  searchDate = "";
  searched = false;

  constructor(
    private apiService: ApiService
  ) { }

  ngOnInit() {
    this.apiService.getPatients().subscribe(
      (data:any) => {
        this.patientData = data && data.entry;
        this.patientData.sort(function (left, right) {
          return moment.utc(left.resource.birthDate).diff(moment.utc(right.resource.birthDate))
      });
      }
    );
    
  }

  searchUser() {
    this.searched = true;
    const newDate = new Date(this.searchDate);
    this.apiService.getFilteredPatients(this.searchText, newDate.getFullYear()).subscribe((response: any) => {
      this.patientData = response && response.entry
      this.searched = false;
    },
    error => {
      console.log('Error in searching');
      this.searched = false;
    });
  }
}


