import { Component, OnInit, AfterViewInit, ViewChild ,ViewEncapsulation,OnDestroy } from '@angular/core';
import { MatSnackBar,MatSnackBarConfig} from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { ReportResponse } from 'src/app/models/api-model/Report/ReportResponse.model';
import { SharedReportRequest } from 'src/app/models/api-model/Report/SharedReportRequest.model';
import { ApplicationUser } from 'src/app/models/api-model/authentication/ApplicationUser';
import { UserResponse } from 'src/app/models/api-model/authentication/UserResponse.model';
import { AuthenticationService } from 'src/app/services/authentication/authentication.service';
import { GridSharedMethodsService } from 'src/app/services/grid-shared-service/grid-shared-methods.service';
import { ListBoxSharedMethodsService } from 'src/app/services/list-box-shared-methods/list-box-shared-methods.service';
import { ReportOlapService } from 'src/app/services/report-olap/report-olap.service';
import { SharedMethodsService } from 'src/app/services/shared-methods/shared-methods.service';
import { SharedService } from 'src/app/services/shared/shared.service';
declare const $: any;

@Component({
  selector: 'app-share-report',
  templateUrl: './share-report.component.html',
  styleUrls: ['./share-report.component.css']
})
export class ShareReportComponent  implements OnInit, AfterViewInit,OnDestroy{
  //dateee
  classAlertError='k-widget k-tooltip k-tooltip-validation k-invalid-msg';
  classWarningError='k-icon k-i-warning';
  startDate!: Date; // Define a property to store the selected date
  endDate!: Date; // Define a property to store the selected date
  /////////////
  user!: ApplicationUser;
  sharedReportRequest: SharedReportRequest={
    idReport:'',
    listIdUsers:[]

  };
  allUsers:UserResponse[] = [];
  listReports!: ReportResponse[];
  filterTextAllUsers='';
  filterTextSharedUsers='';
  placeHolderFilter='Filter';
  lblListBoxAllUsers='All Users';
  lblListBoxSharedUsers='Shared Users';
  lblloadinUser='Please wait loading users....!';
  loadingUsers=false;
  loadingGridShareReports=false;
  lblloadingGrid='Please wait loading Data....!';
  btnShareReport ='Share Report';
  messageErrorValidSharedUsers='Please select User(s)!!!';
  messageErrorValidGrid='Please select Report!!!';
  controlValidationReport=false;
  controlValidationUser=false;
  lblloadinEventShareb='Please wait loading sharebility report!';
  loadingSharebEvent=false;
  constructor( private router: Router,
    private snackbar: MatSnackBar,
    private sharedService: SharedService,
    private authenticationService: AuthenticationService,
    private reportService: ReportOlapService,
    private sharedListBoxServiceMethod: ListBoxSharedMethodsService,
    private sharedMethodService: SharedMethodsService,
    private sharedGridService:GridSharedMethodsService,


    ) {
  }
  ngOnDestroy(): void {
  }
  ngAfterViewInit(): void {
    this.sharedListBoxServiceMethod.initializelistBoxComp(
      'allUsers',
      'userName',
      'idUser',
      'multiple',
      ["moveUp", "moveDown", "transferTo", "transferFrom", "transferAllTo", "transferAllFrom", "remove"],
      "usersToShare",
      [],
      null,
      null
    );
    this.sharedMethodService.setWidthHeightKendoCom(
      'allUsers',
      'kendoListBox',
      200,
      250
    );
    this.sharedListBoxServiceMethod.initializelistBoxComp(
      'usersToShare',
      'userName',
      'idUser',
      'multiple',
      [],
      null,
      [],
      null,
      null
    );
    this.sharedMethodService.setWidthHeightKendoCom(
      'usersToShare',
      'kendoListBox',
      200,
      250
    );

 // this.callKendoJqueryListBox('allUsers');
 // this.callKendoJqueryListBox('usersToShare');
 /* var listBoxAllUsers = this.setWidthHeightKendoCom(
    'allUsers',
    'kendoListBox',
    200,
    250
  );*/
 /* var listBoxUsersToShared = this.setWidthHeightKendoCom(
    'usersToShare',
    'kendoListBox',
    200,
    250
  );
  }*/
}
  ngOnInit(): void {
    this.displayReport();
    var today = new Date();
    var startOfLastMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1);
     this.startDate=startOfLastMonth;
     this.endDate=today;
    this.getUsers();
    this.GetSharedReportsById(this.startDate,this.endDate);
  }
  displayReport(){

    this.sharedService.dateChangeEvent$.subscribe(({ startDate, endDate,btnId}) => {
    // Use startDate and endDate here to fetch reports
    if(btnId=="btn-di-shared-rep"){
    //  this.startDate = startDate;
     // this.endDate = endDate;
      this.GetSharedReportsById(startDate,endDate);
    }

  });
}
destroyGridBeforeClickBtn(){
  var grid= $('#gridReportsSharebale');
  if ( grid && grid.data('kendoGrid')) {
    $('#gridReportsSharebale').data('kendoGrid').destroy();
  }
}

 /* setWidthHeightKendoCom(compId: any, comType: any, width: any, height: any) {
    var listBox = this.callKendoComponent(compId, comType);
    // Set the width and height
    listBox.wrapper.css({
      width: width + 'px', // Set the desired width
      height: height + 'px', // Set the desired height
    });
  }*/
  GetSharedReportsById(startDate:Date,endDate:Date){
  //  console.log('nourann1',this.sharedMethodService.tranformdat(startDate));
  //  console.log('nourann2',this.sharedMethodService.tranformdat(endDate));
    this.loadingGridShareReports=true;
    this.user = this.sharedService.user;
    this.reportService.GetReportByUserId(this.user.id,true,this.sharedMethodService.tranformdat(startDate),
    this.sharedMethodService.tranformdat(endDate)).subscribe({
      next: (successResponse) => {
        console.log('report list is ', successResponse);
        this.listReports = successResponse;
        this.destroyGridBeforeClickBtn();
        $('#gridReportsSharebale').css('display', '');
        this.InitializeGrid();
        this.loadingGridShareReports=false;
      },
      error: (errorResponse) => {
        this.loadingGridShareReports=false;
        console.log(errorResponse);
      //  this.showSnackbar('Error contact Admin','Error!','');
      this.sharedMethodService.showSnackbar(
        'Error contact Admin',
        'Error!',
        ''
      );
      },
    });
  }
  prepareColumnGrid(): any[] {
    return [
      { field: 'reportName', title: 'Report Name' ,width: "100px"},
      { field: 'interpretationReport', title: 'Interpretation Report' ,width: "250px" },
      { field: 'isSharebale', title: 'is Shareabale',width: "100px" },
      { field: 'dateCreation', title: 'date Creation', format: '{0:dd/MM/yyyy HH:mm:ss}',width: "100px"},
      { field: 'dateUpdate', title: 'date Update', format: '{0:dd/MM/yyyy HH:mm:ss}',width: "100px"},
      { field: 'olapCubeName', title: 'data Source',width: "100px" },

    ];
  }
  InitializeGrid() {
    $('#gridReportsSharebale')
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

   }
  getUsers() {
    this.loadingUsers=true;
    this.user = this.sharedService.user;
    this.authenticationService.GetUsers(this.user.id).subscribe({
      next: (successResponse) => {
        console.log(successResponse);
        this.allUsers=successResponse;
        this.populateListBoxAllUsers();
        this.loadingUsers=false;

      },
      error: (errorResponse) => {
        this.loadingUsers=false;
        console.log(errorResponse);
       // this.showSnackbar('Error contact Admin','Error!','');
       this.sharedMethodService.showSnackbar(
        'Error contact Admin',
        'Error!',
        ''
      );

      },
    });
  }
  populateListBoxAllUsers(){
    var listBoxAllUsers= this.sharedMethodService.callKendoComponent('allUsers','kendoListBox');
    listBoxAllUsers.setDataSource(this.allUsers);
  }
 /* callKendoJqueryListBox(componentId: string) {
    var usersToShare = componentId== 'usersToShare';
    $(`#${componentId}`).kendoListBox({
     connectWith: usersToShare?null: "usersToShare",
      dataSource: {
        data: [],
      },
      dataTextField: 'userName',
      dataValueField: 'idUser',
      reorder: this.reorderListBox.bind(this),
      toolbar: {
        tools: usersToShare?null: ["moveUp", "moveDown", "transferTo", "transferFrom", "transferAllTo", "transferAllFrom", "remove"]
    },
     // remove: removeEnabled ? this.removeFromListBox.bind(this) : null,
    });

  }*/
 /* reorderListBox(e: {
    preventDefault: () => void;
    sender: { dataSource: any; dataItems: () => any };
    dataItems: any[];
    offset: any;
  }) {
    e.preventDefault();
    var dataSource = e.sender.dataSource;

    var dataItem = e.dataItems[0];
    var index = dataSource.indexOf(dataItem) + e.offset;
    dataSource.remove(dataItem);
    dataSource.insert(index, dataItem);
    var data = dataSource.data();
    var firstItemId = data[0].id;
  }*/
 /* callKendoComponent(compId: any, compType: any): any {
    return $(`#${compId}`).data(compType);
  }*/
  /*selectedRowGrid():any{
    var grid = this.callKendoComponent('gridReportsSharebale', 'kendoGrid');
    var selectedRow = grid.select();
    var dataItem = grid.dataItem(selectedRow);
    return dataItem;

  }*/

  controlValidationSharebility():any{
    var validItems=true;
    var listBoxUsers = this.sharedMethodService.callKendoComponent('usersToShare','kendoListBox').dataSource.data();
    var selectedReport=this.sharedGridService.selectedRowGrid('gridReportsSharebale','kendoGrid');
    if(listBoxUsers.length==0){
      validItems=false;
      this.showErrValdUser();
    }
    if(selectedReport== null){

      validItems=false;
      this.showErrValdReport();
    }
    return validItems;
  }
  shareReport(){
    if(this. controlValidationSharebility()){
      this.loadingSharebEvent=true;
      var listBoxUserToShare = this.sharedMethodService.callKendoComponent('usersToShare','kendoListBox').dataSource.data();
      var idReport=this.sharedGridService.selectedRowGrid('gridReportsSharebale', 'kendoGrid').id;
      var listIdUsers: any[]=[];
      listBoxUserToShare.map(function (
        item:any
      ) {
      listIdUsers.push(item.idUser)
      });
      this.sharedReportRequest.idReport=idReport;
      this.sharedReportRequest.listIdUsers=listIdUsers;
      this.reportService.ShareReportByUsers(this.sharedReportRequest).subscribe({
        next: (successResponse) => {
          this.loadingSharebEvent=false;
          console.log('sharebale', successResponse);
         // this.showSnackbar('Report Shared Succefully','Success','succ-snackbar');
          this.sharedMethodService.showSnackbar(
            'Report Shared Succefully',
            'Success',
            'succ-snackbar'
          );
        },
        error: (errorResponse) => {
          this.loadingSharebEvent=false;
          console.log('Not sharebale',errorResponse);
        //  this.showSnackbar('Error contact Admin','Error!','');
        this.sharedMethodService.showSnackbar(
          'Error contact Admin',
          'Error!',
          ''
        );
        },
      })
  }

  }
 /* applyFilterComponent(
    kendoCompId: string,
    kendoCompType: string,
    filterText: string,
    fieldTarget:string
  ) {
    var kendoComponent = $(`#${kendoCompId}`).data(kendoCompType);
    var filterValue = filterText.toLowerCase();
    kendoComponent.dataSource.filter({
      field:fieldTarget,
      operator: 'contains',
      value: filterValue,
    });
  }*/
  showErrValdUser() {
    this.controlValidationUser= true;
    setTimeout(() => {
      this.controlValidationUser = false;
    }, 3000);
  }
  showErrValdReport() {
    this.controlValidationReport= true;
    setTimeout(() => {
      this.controlValidationReport = false;
    }, 3000);
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

}
