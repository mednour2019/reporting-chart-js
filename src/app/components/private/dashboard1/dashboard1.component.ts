import { Component,AfterViewInit ,OnInit} from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { DataSharingService } from 'src/app/services/dataService.service';
import { Router } from '@angular/router';
import { ApplicationUser } from 'src/app/models/api-model/authentication/ApplicationUser';
import { SharedService } from 'src/app/services/shared/shared.service';
import { AuthenticationService } from 'src/app/services/authentication/authentication.service';
import { MatSnackBar,MatSnackBarConfig} from '@angular/material/snack-bar';
import { ReportOlapService } from 'src/app/services/report-olap/report-olap.service';
import { ReportsComponent } from '../../reports/reports.component';
declare const $: any;
@Component({
  selector: 'app-dashboard1',
  templateUrl: './dashboard1.component.html',
  styleUrls: ['./dashboard1.component.css']
})
export class Dashboard1Component  implements OnInit,AfterViewInit{

  constructor(){}
  ngAfterViewInit(): void {


  }


  ngOnInit(): void {
   /* this.dataSharingService.refreshRequested.subscribe((refresh) => {
      if (refresh) {
       //alert(true)
      }

      })*/

     // this.GetReportsById();


  }





}
