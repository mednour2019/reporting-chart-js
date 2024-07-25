import { Component, AfterViewInit, OnInit, ViewChild, ElementRef } from '@angular/core';
import { MaxValidator } from '@angular/forms';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { ApplicationUser } from 'src/app/models/api-model/authentication/ApplicationUser';
import { olapCubeChoosen } from 'src/app/models/api-model/olap-cube-choosen.model';
import { requestReportChart } from 'src/app/models/api-model/report-chart/request-report-chart.model';
import { responseReportColChart } from 'src/app/models/api-model/report-chart/response-report-col-chart.model';
import { responseReportPieChart } from 'src/app/models/api-model/report-chart/response-report-pie-chart.model';
import { AuthenticationService } from 'src/app/services/authentication/authentication.service';
import { DataSharingService } from 'src/app/services/dataService.service';
import { KendoChartService } from 'src/app/services/kendo-chart/kendo-chart.service';
import { ReportOlapService } from 'src/app/services/report-olap/report-olap.service';
import { SharedApiMethodsService } from 'src/app/services/shared-api-methods/shared-api-methods.service';
import { SharedMethodsService } from 'src/app/services/shared-methods/shared-methods.service';
import { SharedService } from 'src/app/services/shared/shared.service';
declare const $: any;
@Component({
  selector: 'app-statistics',
  templateUrl: './statistics.component.html',
  styleUrls: ['./statistics.component.css'],
})
export class StatisticsComponent implements OnInit, AfterViewInit {
  @ViewChild('myDivElement', { static: false }) myDivElement!: ElementRef;
  @ViewChild('myDivElement2', { static: false }) myDivElement2!: ElementRef;
  user!: ApplicationUser;
  numberUser = 0;
  listDataPieChart!: responseReportPieChart[];
  listDataFormula!: responseReportColChart[];
  listShareab!: responseReportColChart[];

  olapCubeChoosen!:olapCubeChoosen;
  requestReportChart:requestReportChart={
    UserId:'',
    isSharebale:0,
  };
  constructor(
    private dataSharingService: DataSharingService,
    private sharedService: SharedService,
    private authenticationService: AuthenticationService,
    private snackbar: MatSnackBar,
    private reportService: ReportOlapService,
    private sharedMethodService:SharedMethodsService,
    private sharedMethodApiMethods:SharedApiMethodsService,
    private kendoChartService: KendoChartService,

  ) {}
  ngAfterViewInit(): void {

    this.GetReportsById();
    this.GetColCHartFomrula();


  }
  ngOnInit(): void {
    this.olapCubeChoosen=this.sharedMethodService.initializeOlapCubeChoosen();

    this.getUsers();

  }

  GetColCHartFomrula(){
    var newChartContainer2: HTMLElement = this.myDivElement2.nativeElement;
 this.reportService.GetReportByIdColCharts().subscribe({
      next: (successResponse) => {
        this.listDataFormula = successResponse.reports;
        console.log('calculaaaaaaaaaaaaaaaaa',successResponse)
        this.kendoChartService.createColBarOrStackedChart(
          this.listDataFormula,
          newChartContainer2,
          'column',
          false,
        successResponse.max+5,
        'Number of formula by data source',
          45,
          1100,
          600,
          'y'
        );
        var chart = $(`#bar-chart`).data('kendoChart');
        chart.options.series.map((item: any) => {
          item.labels.format =null;/*"{0:p}"*/ /*"{0}%"*/;
         item.tooltip.template='#=category #: #= value #';
        });
        chart.options.valueAxis.labels.format=null;

        chart.redraw();

      },
      error: (errorResponse) => {
        this.sharedMethodService.showSnackbar('Error contact Admin', 'Error!', '');
      },
    });
  }
  GetReportsById() {
    var newChartContainer: HTMLElement = this.myDivElement.nativeElement;
   // console.log("dnewChartContainervvvvvvvvvvvv",newChartContainer)
    this.user = this.sharedService.user;
    this.requestReportChart.UserId=this.user.id;
   // var olapCubeSelected = this.sharedMethods.selectedValueListBox('listCalc', 'kendoListBox');
    this.reportService.GetReportByIdPieCharts(this.requestReportChart).subscribe({
      next: (successResponse) => {
        this.listDataPieChart = successResponse;
        this.kendoChartService.createPieChart(
          this.listDataPieChart,
          newChartContainer,
          'Number of reports created by data sources',
          900,
          450,
          45
        );
        var chart = $(`#pie-chart`).data('kendoChart');
        chart.options.series.map((item: any) => {
          item.labels.format =null;/*"{0:p}"*/ /*"{0}%"*/;
          item.tooltip.template='#=category #: #= value #';
        });
        chart.redraw();



      },
      error: (errorResponse) => {
        this.sharedMethodService.showSnackbar('Error contact Admin', 'Error!', '');
      },
    });
  }

  getUsers() {
    this.user = this.sharedService.user;
    this.authenticationService.GetUsers(this.user.id).subscribe({
      next: (successResponse) => {
        console.log(successResponse);
        this.numberUser = successResponse.length + 1;
      },
      error: (errorResponse) => {
        this.sharedMethodService.showSnackbar('Error contact Admin', 'Error!', '');
      },
    });
  }

}
