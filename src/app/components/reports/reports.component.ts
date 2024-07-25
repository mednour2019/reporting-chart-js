import {
  Component,
  OnInit,
  AfterViewInit,
  ViewChild,
  ViewEncapsulation,
  OnDestroy,
  SimpleChanges,
  ElementRef,
} from '@angular/core';
import { MatDatepicker } from '@angular/material/datepicker';
import { MatSnackBar,MatSnackBarConfig} from '@angular/material/snack-bar';
import { NavigationStart, Router } from '@angular/router';
import { ReportResponse } from 'src/app/models/api-model/Report/ReportResponse.model';
import { UpdatedReportRequest } from 'src/app/models/api-model/Report/UpdatedReportRequest.model';
import { ApplicationUser } from 'src/app/models/api-model/authentication/ApplicationUser';
import { hierarchyRow } from 'src/app/models/api-model/hierarchyRow.model';
import { olapCubeChoosen } from 'src/app/models/api-model/olap-cube-choosen.model';
import { GridSharedMethodsService } from 'src/app/services/grid-shared-service/grid-shared-methods.service';
import { KendoChartService } from 'src/app/services/kendo-chart/kendo-chart.service';
import { KendoDialogSharedMethodsService } from 'src/app/services/kendo-dialog-shared-methods/kendo-dialog-shared-methods.service';
import { ReportOlapService } from 'src/app/services/report-olap/report-olap.service';
import { SharedMethodsService } from 'src/app/services/shared-methods/shared-methods.service';
import { SharedService } from 'src/app/services/shared/shared.service';
import { WizardCubeService } from 'src/app/services/wizard-cube/wizard-cube.service';

declare const $: any;
@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.css'],
})
export class ReportsComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('myDivElement', { static: false }) myDivElement!: ElementRef;
  // related about date  validation check
  startDate!: Date; // Define a property to store the selected date
  endDate!: Date; // Define a property to store the selected date
  ///////////////////////////////////////

  newPosition = {
    field: 'position',
    title: 'Position',
    columns: null,
    width: "150px"
  };
  classAlertError='k-widget k-tooltip k-tooltip-validation k-invalid-msg';
  classWarningError='k-icon k-i-warning';

  olapCubeChoosen!: olapCubeChoosen; /*olapCubeChoosen = {
    sqlServerInstance: '',
    olapCubeName: '',
    olapCubeDimensions: [],
    olapCubeMeasures: [],
    olapCubeCalculations: [],
    measCalChoosen: [],
    attribRowsFormatReport: '',
    attribKpiColFormatReport: '',
    attribFiltFormatReport: '',
    nbRowInQuery: 0,
    nbColInQuery: 0,
    listHirearchyRows:[],
    InterpretationReport:'',
    colSmartGrid:[]
  };*/
  reportToUpdate:UpdatedReportRequest={
    Id:'',
    ReportName:'',
    InterpretationReport:'',
    isSharebale:0,
  };
  user!: ApplicationUser;
  //listReports:ReportResponse[] =[];
  listReports!: ReportResponse[];
  confirmDel='Confirm Delete';
  confirmView='Confirm View Report';
  sureDel='Are you sure you want to delete this record?';
  sureView='Are you sure you want to view this  report?';
  //update report dialog///////////////////////////////
  reportNameInput='';
  reportInterpInput='';
  ctrlValdRepName=false;
  ctrlValdRepInterp=false;
  msgErrorValdRepName='please Enter repot Name!';
  msgErrorValdRepInterp='please Enter repot Interpretation !';
  isShareable=false;
  ////////update report dialog////////////////////////
  //  related about label////////////////
  lblloadingGrid='please wait until load Data !'
  lblloadingViewReport='please wait until prepare report parameters !'
  loadingGridReports=false;
  ////////////////////////////
  routerSubscription: any;
  constructor(
    private reportService: ReportOlapService,
    private router: Router,
    private snackbar: MatSnackBar,
    private sharedService: SharedService,
    private sharedMethodService:SharedMethodsService,
    private kendoDialogSharedService: KendoDialogSharedMethodsService,
    private sharedGridService:GridSharedMethodsService,
    private kendoChartService: KendoChartService,
    private wizardCubeService: WizardCubeService,
    private buttonStateService:SharedService


  ) {}
  ngOnDestroy(): void {

  }

  ngOnInit() {
    this.displayReport();
    var today = new Date();
    var startOfLastMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1);
     this.startDate=startOfLastMonth;
     this.endDate=today;
    this.olapCubeChoosen=this.sharedMethodService.initializeOlapCubeChoosen();
    this.GetReportsById(this.startDate,this.endDate);
      // Subscribe to the NavigationStart event of the Router
      this.routerSubscription = this.router.events.subscribe((event) => {
        if (event instanceof NavigationStart) {
          // Close the Kendo UI window when navigating away
          this.kendoDialogSharedService.closeKendoDialog(
            'updateRportDialog',
            'kendoDialog'
          );
          this.kendoDialogSharedService.closeKendoDialog(
            'deleteDialogReport',
            'kendoDialog'
          );
          this.kendoDialogSharedService.closeKendoDialog(
            'viewReportDialog',
            'kendoDialog'
          );
         // this.closeKendoDialog('updateRportDialog','kendoDialog');
         // this.closeKendoDialog('deleteDialogReport','kendoDialog');
          //this.closeKendoDialog('viewReportDialog','kendoDialog');
        }
      });
      this.FillSelectionDialogInputs();

  }
 /* closeKendoDialog(kendoDialogId:any,kendoDialogType:any) {
    var dialogComKendo = $(`#${kendoDialogId}`); // Replace with your window element selector
    if (dialogComKendo && dialogComKendo.data(kendoDialogType)) {
     // $(`#${kendoDialogId}`).data('kendoDialog').close();
      this.callKendoComponent(kendoDialogId,kendoDialogType).close();
      dialogComKendo.data(kendoDialogType).destroy();
    }
  }*/

  ngOnChanges(_changes: SimpleChanges){
    this.ngOnInit();
  }
 /* tranformdat(daten:Date):any{
      var year = daten.getFullYear();
      var month = (daten.getMonth() + 1).toString().padStart(2, '0');
     var day = daten.getDate().toString().padStart(2, '0');
      return `${year}-${month}-${day}`;
  }*/

  GetReportsById(startDate:Date, endDate:Date) {
    this.loadingGridReports=true;
    this.user = this.sharedService.user;
    console.log('user id is use', this.user.id);
   // console.log('start dateeeeeeeeeeeee',this.tranformdat(this.startDate) );
   // console.log('end dateeeeeeeeeeeee',this.tranformdat(this.endDate) );
    this.reportService.GetReportByUserId(this.user.id,false,this.sharedMethodService.tranformdat(startDate),
    this.sharedMethodService.tranformdat(endDate)).subscribe({
      next: (successResponse) => {
        console.log('report list is ', successResponse);
        this.listReports = successResponse;
        this.destroyGridBeforeClickBtn();
        $('#gridReports').css('display', '');
        this.InitializeGrid();
        this.loadingGridReports=false;
      },
      error: (errorResponse) => {
        this.loadingGridReports=false;
        console.log(errorResponse);
        this.sharedMethodService.showSnackbar('Error contact Admin','Error!','');

      },
    });
  }
  ngAfterViewInit(): void {
   // this.InitializeGrid();
  // this.setConfigurationKendoDialog('deleteDialogReport',400,220);
  // this.setConfigurationKendoDialog('updateRportDialog',600,380);
  // this.setConfigurationKendoDialog('viewReportDialog',400,220);
   this.kendoDialogSharedService.setConfigurationKendoDialog(
    'deleteDialogReport',
    500,
    250,
    'remove Report'
  );
  this.kendoDialogSharedService.setConfigurationKendoDialog(
    'updateRportDialog',
    1150,
    600,
    'Edit Report'
  );
  this.kendoDialogSharedService.setConfigurationKendoDialog(
    'viewReportDialog',
    500,
    300,
    'View report'
  );
  }
 /* setConfigurationKendoDialog(compId: any ,width:any,height:any) {
    $(`#${compId}`).kendoDialog({
      visible: false,
      modal: true,
      title: 'Remove Report', // Set the title
      width: width+'px',
      height:height+'px'

    });
  }*/
  prepareColumnGrid(): any[] {
    return [
      { field: 'reportName', title: 'Report Name' ,width: "100px"},
      { field: 'interpretationReport', title: 'Interpretation Report',width: "250px" },
      { field: 'isSharebale', title: 'is Shareabale',width: "100px" },
      { field: 'dateCreation', title: 'date Creation', format: '{0:dd/MM/yyyy HH:mm:ss}',width: "100px"},
      { field: 'dateUpdate', title: 'date Update', format: '{0:dd/MM/yyyy HH:mm:ss}',width: "100px"},
      { field: 'olapCubeName', title: 'data Source',width: "100px" },

      {
        title: 'Actions',
        template: this.myDivElement.nativeElement.innerHTML,
        width: "100px"
        //  "<button class='k-button k-grid-edit btn-grid'> <i class='fa fa-edit ic-grid' aria-hidden='true'> </i> &nbsp; Edit</button><button class='k-button k-grid-remove btn-grid'><i class='fa fa-trash ic-grid' aria-hidden='true'> </i>&nbsp; Remove</button><button class='k-button k-grid-view btn-grid'> <i class='fa fa-eye ic-grid' aria-hidden='true'> </i> &nbsp; View</button>",
      },
    ];
  }
  InitializeGrid() {
   $('#gridReports')
      .kendoGrid({
        dataSource: {
          data: this.listReports,
          schema: {
            model: {
              uid: 'id',
              fields: {
                id: { type: 'string' },
                reportName: { type: 'string' },
                interpretationReport: { type: 'string' },
                isSharebale: { type: 'string' },
                sqlServerInstance : { type: 'string' },
                olapCubeName : { type: 'string' },
                measCalChoosen : { type: 'string' },
                attribRowsFormatReport : { type: 'string' },
                attribKpiColFormatReport : { type: 'string' },
                attribFiltFormatReport : { type: 'string' },
                nbRowInQuery: { type: 'number' },
                nbColInQuery: { type: 'number' },
                dateCreation:{ type: 'Date' },
                dateUpdate:{ type: 'Date' },
                valueColumnFiltered: { type: 'string' },
                calculations: { type: 'string' },

              },
            },
          },
          group: [
            { field: "olapCubeName" }
          ]
        },
        selectable: 'row',
        columns: this.prepareColumnGrid(),
       // resizable: true,
       // reorderable: true,
       // columnMenu: true,
        pageable: {
          refresh: false,
          pageSizes: true,
          buttonCount: 5,
        },
        groupable: true,
        filterable: true,
        toolbar: ["excel", "pdf"],
        sortable: true,
        navigatable: true,
         resizable: true,
        reorderable: true,
        columnMenu: true,
      })
      .data('kendoGrid');
       //handle remove event
    $('#gridReports').on('click', '.k-grid-remove', (e:any) => {
     // this.selectAutomaticallyRowInGrid(e);
      this.sharedGridService.selectAutomaticallyRowInGrid(e);
      this.kendoDialogSharedService.openCenteredDialog('deleteDialogReport');
     // this.openDialogRemove();
    });
      // handle edit event
      $('#gridReports').on('click', '.k-grid-edit', (e: any) => {
      //  $("#updateRportDialog").data("kendoDialog").title("Edit Report");
      // this.selectAutomaticallyRowInGrid(e);
       this.sharedGridService.selectAutomaticallyRowInGrid(e);
       this.kendoDialogSharedService.openDialog('updateRportDialog','gridReports','kendoGrid');
      //  this.openDialogEdit();
      });
      // handle edit event
      $('#gridReports').on('click', '.k-grid-view', (e: any) => {
       //console.log('eye eye view');
     //  $("#viewReportDialog").data("kendoDialog").title("View Report");
     this.sharedGridService.selectAutomaticallyRowInGrid(e);
      // this.selectAutomaticallyRowInGrid(e);
      // this.openDialogView();
      this.kendoDialogSharedService.openCenteredDialog("viewReportDialog");

      });
  }
  /*openDialogView(){
    this.openCenteredDialog('viewReportDialog');
  }*/
  /*selectAutomaticallyRowInGrid(e:any){
    var row = $(e.target).closest("tr");
    var grid = row.closest(".k-grid").data("kendoGrid");
    grid.select(row);

  }*/
  /*openDialogEdit() {
      var dataItem =this.selectedRowGrid();
      this.FillSelectionDialogInputs(dataItem);
      this.openCenteredDialog('updateRportDialog');
   }*/
   showErrValdRepName() {
    this.ctrlValdRepName= true;
    setTimeout(() => {
      this.ctrlValdRepName = false;
    }, 3000);
  }
  showErrValdRepInterp() {
    this.ctrlValdRepInterp= true;
    setTimeout(() => {
      this.ctrlValdRepInterp = false;
    }, 3000);
  }
   controlValidationCompDialog():any{
    var validItems=true;
    var editedReportName=this.reportNameInput;
    var editedReportInterp=this.reportInterpInput;
    if(editedReportName== ''){
      validItems=false;
      this.showErrValdRepName();
    }
    if(editedReportInterp== ''){
      validItems=false;
      this.showErrValdRepInterp();
    }
    return validItems
  }
  /*selectedRowGrid():any{
    var grid = this.callKendoComponent('gridReports', 'kendoGrid');
    var selectedRow = grid.select();
    var dataItem = grid.dataItem(selectedRow);
    return dataItem;

  }*/
  prepareDataToUpdate(){
   // var dataItem=this.selectedRowGrid();
   var dataItem=this.sharedGridService.selectedRowGrid('gridReports', 'kendoGrid');
    this.reportToUpdate.Id=dataItem.id;
    this.reportToUpdate.ReportName=this.reportNameInput;
    this.reportToUpdate.InterpretationReport=this.reportInterpInput;
    this.reportToUpdate.isSharebale=this.isShareable?1:0;
  }
  destroyGridBeforeClickBtn(){
    var grid= $('#gridReports');
    if ( grid && grid.data('kendoGrid')) {
      $('#gridReports').data('kendoGrid').destroy();
    }
  }
   UpdateReport(){
    if(this.controlValidationCompDialog())
    {
      this.prepareDataToUpdate();
      this.reportService.UpdateReport(this.reportToUpdate).subscribe({
        next: (successResponse) => {
          console.log('isUpdated', successResponse);
        //  this.cancelDialog("updateRportDialog");
        this.kendoDialogSharedService.cancelDialog('updateRportDialog');
        //  this.showSnackbar('ReportUpdated Succefully','Success','succ-snackbar');
          this.sharedMethodService.showSnackbar(
            'Report Updated Succefully',
            'Success',
            'succ-snackbar'
          );
          this.GetReportsById(this.startDate,this.endDate);
        },
        error: (errorResponse) => {
          console.log(errorResponse);
          this.kendoDialogSharedService.cancelDialog('updateRportDialog');
        // this.cancelDialog("updateRportDialog");
          //this.showSnackbar('Error contact Admin','Error!','');
          this.sharedMethodService.showSnackbar(
            'Error contact Admin',
            'Error!',
            ''
          );
        },
      })



    }
   }
  /* FillSelectionDialogInputs(dataItem: any) {
    this.reportNameInput = dataItem.reportName;
    this.reportInterpInput=dataItem.interpretationReport;
    this.isShareable=dataItem.isSharebale=='sharebae'?true:false;

  }*/
  FillSelectionDialogInputs(){
    this.kendoDialogSharedService.FillSelectionDialogInputs.subscribe((dataItem: any) => {
      this.reportNameInput = dataItem.reportName;
      this.reportInterpInput=dataItem.interpretationReport;
      this.isShareable=dataItem.isSharebale=='Shareabale'?true:false;
   //console.log('datatitelm',dataItem);
    });
  }
  /*openDialogRemove() {
    var grid = this.callKendoComponent('gridReports', 'kendoGrid');
    var selectedRow = grid.select();
    if (selectedRow.length > 0) {
      this.openCenteredDialog('deleteDialogReport');
    } else {
      console.log('no row selected');
    }
  }*/
 /* callKendoComponent(compId: any, compType: any): any {
    return $(`#${compId}`).data(compType);
  }*/
 /* openCenteredDialog(dlgComp: any) {
    var Dialog = $(`#${dlgComp}`).data('kendoDialog');
    Dialog.open();
  }*/
  removeRecord() {
     // var dataItem=this.selectedRowGrid();
     var dataItem= this.sharedGridService.selectedRowGrid('gridReports', 'kendoGrid');
      this.reportService.RemoveReportById(dataItem.id).subscribe({
        next: (successResponse) => {
          console.log('isRemoved', successResponse);
          this.kendoDialogSharedService.cancelDialog("deleteDialogReport");
         // this.showSnackbar('Report Deleted Succefully','Success','succ-snackbar');
          this.sharedMethodService.showSnackbar(
            'Report Deleted Succefully',
            'Success',
            'succ-snackbar'
          );
          this.GetReportsById(this.startDate,this.endDate);
        },
        error: (errorResponse) => {
         // this.cancelDialog("deleteDialogReport")
          this.kendoDialogSharedService.cancelDialog("deleteDialogReport");
         // this.showSnackbar('Error contact Admin','Error!','');
          this.sharedMethodService.showSnackbar(
            'Error contact Admin',
            'Error!',
            ''
          );
          console.log(errorResponse);
        },
      })
  }
  cancelDialog(dialogComp: any) {

    this.kendoDialogSharedService.cancelDialog(dialogComp);
  }
 /* prepareHiearRow(attrRowFormat:any):any[]{
    return attrRowFormat
    .split(',')
    .map((part:any, index:any) => {
      const subparts = part.split('.');
      if (subparts.length > 1) {
        return {
          rowName: subparts[1].replace(/\[|\]/g, ''),
          levelHierNumber: index,
        };
      }
      return null;
    })
    .filter((item:any) => item !== null) as hierarchyRow[];
  }*/
  prepareDataViewReport(){

    var grid = this.sharedMethodService.callKendoComponent('gridReports', 'kendoGrid');
    var selectedRow = grid.select();
    var dataItem = grid.dataItem(selectedRow);
    this.olapCubeChoosen.sqlServerInstance=dataItem.sqlServerInstance;
    this.olapCubeChoosen.olapCubeName=dataItem.olapCubeName;
    this.olapCubeChoosen.measCalChoosen=dataItem.measCalChoosen.split(',').map((item:any) => item.trim());
    this.olapCubeChoosen.attribRowsFormatReport=dataItem.attribRowsFormatReport;
    this.olapCubeChoosen.attribKpiColFormatReport=dataItem.attribKpiColFormatReport;
    this.olapCubeChoosen.attribFiltFormatReport=dataItem.attribFiltFormatReport;
    this.olapCubeChoosen.nbRowInQuery=dataItem.nbRowInQuery;
    this.olapCubeChoosen.nbColInQuery=dataItem.nbColInQuery;
    //this.olapCubeChoosen.listHirearchyRows=this.prepareHiearRow(dataItem.attribRowsFormatReport);
    this.olapCubeChoosen.InterpretationReport=dataItem.interpretationReport;
    this.olapCubeChoosen.ValueColumnFiltered=dataItem.valueColumnFiltered;
    var match = this.olapCubeChoosen.attribKpiColFormatReport.match(/\{(.*?)\}/);
    var listKpi:any[]=[];
    if (match && match.length > 1) {
       listKpi=match[1].split(",").map(item => item.replace(/[\[\]]/g, '').trim());
    }
     if(this.olapCubeChoosen.nbColInQuery==0){
     /* this.olapCubeChoosen.colSmartGrid=this.sharedMethodService.
      prepareColumnReport(this.olapCubeChoosen.colSmartGrid,listKpi);*/

      this.olapCubeChoosen.colSmartGrid =
      listKpi.map((kpi: string) => {
        return {
          field: this.cleanSpecCharDec(kpi),
          title: kpi,
          columns: null,
          width: "150px",
          format:dataItem.calculations==""?this.kendoChartService.formatRound3
          :this.searchFomratCalculation(kpi,dataItem.calculations.split(',').map((item:any) => item.trim()))

        };
      });
    this.olapCubeChoosen.colSmartGrid.unshift(this.newPosition);
    // console.log("aaaa",this.olapCubeChoosen.colSmartGrid );
    }
    else{
      this.olapCubeChoosen.colSmartGrid = [];
          var listTotalOff: any[] = [];
          var inputString = dataItem.valueColumnFiltered;
          var regexPattern = /\[.*?\].&\[(.*?)\]/g;
          var matches = [...inputString.matchAll(regexPattern)];
          var itemslistResFilt = matches.map((match) => ( match[1]));
        // console.log("aaaa",itemslistResFilt );
        listKpi.map((kpi: any) => {
          this.prepareColumnFilter(
            kpi,
            itemslistResFilt,
            listTotalOff,
            dataItem
          );

        });
        this.olapCubeChoosen.colSmartGrid.unshift(this.newPosition);
        this.olapCubeChoosen.colSmartGrid = [
          ...this.olapCubeChoosen.colSmartGrid,
          ...listTotalOff,
        ];
        // console.log("aaaa",this.olapCubeChoosen.colSmartGrid );


    }
   // console.log("aaaa",listKpi);

  }
  ViewReport(){
    this.prepareDataViewReport();
   this.sharedService.setCubeOlapChoosen(this.olapCubeChoosen);
   console.log("aaaa",this.olapCubeChoosen);
   this.buttonStateService.setDisableButton(true);
    this.router.navigate(['dashboard/smartGrid']);
  }
  searchFomratCalculation(kpi:any,listCalculations:any[]){
    let formatString = this.kendoChartService.formatRound3;
    for (const item of listCalculations) {
      if (kpi === item.split("+")[0]) {
        if (item.split("+")[1] === "Percent") {
          formatString = this.kendoChartService.formatPercent;
        } else if (item.split("+")[1] === "Currency") {
          formatString = this.kendoChartService.formatCurrency;
        }
        break; // Exit the loop once the match is found and format is set
      }
    }
    return formatString;
  }
 /* showSnackbar(message:any,action:any,panelClass:any) {
    // Customize snackbar appearance and behavior
    var config: MatSnackBarConfig = {
      duration: 3000, // Duration in milliseconds
      horizontalPosition: 'right', // 'start' | 'center' | 'end' | 'left' | 'right'
      verticalPosition: 'top', // 'top' | 'bottom'
      panelClass:panelClass,

    };
    this.snackbar.open(message, action, config);

  }*/
  cleanSpecCharDec(columnName: string): string {
    let resultColumn = columnName;
    const regex = new RegExp('[\\s\\W]+', 'g');
    if (regex.test(columnName)) {
      resultColumn = columnName.replace(regex, '_');
    }
    if (/^\d/.test(columnName)) {
      resultColumn = `_${columnName}`;
    }

    return resultColumn;
  }
  prepareColumnFilter(
    kpi: any,
    itemslistResFilt: any[],
    listTotalOff: any[],
    dataItem:any

  ) {
    var colCombKpiAttCol: any[] = [];
    var cleanKPi = this.cleanSpecCharDec(kpi);
    var TotalOffCleanKpi = 'TotalOf' + cleanKPi;
   // this.olapCubeChoosen.measCalChoosen.push(TotalOffCleanKpi);
    itemslistResFilt.map((colItem: any, _index: number) => {
      var cleanAttCol = this.cleanSpecCharDec(colItem);
      var ReskpiCol =  cleanKPi+'_' +cleanAttCol ;
      //this.olapCubeChoosen.measCalChoosen.push(ReskpiCol);
      colCombKpiAttCol.push({
        field: ReskpiCol,
        title: colItem,
        columns: null,
        width: "150px",
        format:dataItem.calculations==""?this.kendoChartService.formatRound3
          :this.searchFomratCalculation(kpi,dataItem.calculations.split(',').map((item:any) => item.trim()))
      });
    /*  if (includeQueryColumn == true) {
        this.olapCubeChoosen.ValueColumnFiltered +=
          index == 0 ? ` ${colItem.originalVal}` : `,${colItem.originalVal}`;
      }*/
    });
    this.olapCubeChoosen.colSmartGrid.push({
      field: null,
      title: kpi,
      columns: colCombKpiAttCol,
    });
    listTotalOff.push({
      field: TotalOffCleanKpi,
      title: 'TotalOf' + kpi,
      columns: null,
      width: "150px",
      format:dataItem.calculations==""?this.kendoChartService.formatRound3
      :this.searchFomratCalculation(kpi,dataItem.calculations.split(',').map((item:any) => item.trim()))
    });
  }
  displayReport(){
      this.sharedService.dateChangeEvent$.subscribe(({ startDate, endDate,btnId}) => {
      // Use startDate and endDate here to fetch reports
      if(btnId=="btn-di-rep"){
        this.startDate = startDate;
      this.endDate = endDate;
      this.GetReportsById(startDate, endDate);
      }

    });


  }
 /* checkFunctionnalityDate():any{
    var validate = true;
    if (this.startDate === null || this.endDate === null) {
        this.emptyDate = true;
        this.displayMsgError();
        setTimeout(() => {
            this.emptyDate = false;
        }, 3000);
        validate = false;
    } else if (this.startDate > this.endDate) {
        this.dateInvalid = true;
        this.displayMsgError();
        setTimeout(() => {
            this.dateInvalid = false;
        }, 3000);
        validate = false;
    } else {
        var monthDifference = (this.endDate.getFullYear() - this.startDate.getFullYear()) * 12 +
                              (this.endDate.getMonth() - this.startDate.getMonth());
        if (monthDifference > 2) {
            this.dateDiff = true;
            this.displayMsgError();
            setTimeout(() => {
                this.dateDiff = false;
            }, 3000);
            validate = false;
        }
    }

    return validate;
  }*/
  /*displayMsgError(){
    if(this.emptyDate==true){
      this.msgErrorEmpty='Please DateStart / DateEnd is empty!';
    }
    else if (this.dateInvalid==true){
      this.msgErrorEmpty=' DateStart is superior of DateEnd!';

    }
    else{
      this.msgErrorEmpty='maximum period to display is 2 months! try to minimize it.';

    }


  }*/

}

