import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { NavigationStart, Router } from '@angular/router';
import { cubeName } from 'src/app/models/api-model/cubename.model';
import { MeasureToProcessRequest } from 'src/app/models/api-model/meas-process-desc.model';
import { measure } from 'src/app/models/api-model/measure.model';
import { olapCubeChoosen } from 'src/app/models/api-model/olap-cube-choosen.model';
import { DropDownSharedMethodsService } from 'src/app/services/drop-down-shared-methods/drop-down-shared-methods.service';
import { GridSharedMethodsService } from 'src/app/services/grid-shared-service/grid-shared-methods.service';
import { KendoDialogSharedMethodsService } from 'src/app/services/kendo-dialog-shared-methods/kendo-dialog-shared-methods.service';
import { ListBoxSharedMethodsService } from 'src/app/services/list-box-shared-methods/list-box-shared-methods.service';
import { SharedMethodsService } from 'src/app/services/shared-methods/shared-methods.service';
import { WizardCubeService } from 'src/app/services/wizard-cube/wizard-cube.service';
declare const $: any;
@Component({
  selector: 'app-meas-desc',
  templateUrl: './meas-desc.component.html',
  styleUrls: ['./meas-desc.component.css']
})
export class MeasDescComponent implements OnInit, AfterViewInit, OnDestroy {
  selectedCube='';
  lblDropdownCube='Select Data Source';
  lblLoadingSaveDesMes='please wait while saving KPI Descripton';
  lblLoadingCube='please wait while loading data source';
  loadingCube=false;
  routerSubscription: any;
  MeasDescription='';
  MeasName='';
  loadingSaveMeasDesc=false;
  filterListBoxCubeMeas='';
  classAlertError='k-widget k-tooltip k-tooltip-validation k-invalid-msg';
  classWarningError='k-icon k-i-warning';
  controlValidationServerSelected2=false;
  messageErrorValidationServerSelected2='please select data source!'
  olapCubeNames: cubeName[] = [];

  olapCubeChoosen!:olapCubeChoosen/* olapCubeChoosen = {
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
  listMeas!: measure[];
  MeasDescrToUpdate:measure={
    id: '',
    measureDescription: '',
    measureName: '',
    selected: false,
  };
  constructor( private wizardCubeService: WizardCubeService,
    private sharedMethodService:SharedMethodsService,
    private router: Router,
    private dropDownMethodService:DropDownSharedMethodsService,
    private sharedGridService:GridSharedMethodsService,
    private kendoDialogSharedService:KendoDialogSharedMethodsService,
    private listBoxMethodService:ListBoxSharedMethodsService,
    ) { }
  ngOnDestroy(): void {

  }
  ngAfterViewInit(): void {

   // this.dropDownMethodService.initializeDropDownComp('ComboDataMart2',' select Data Source','cubeName','cubeName');
   // this.sharedMethodService.setWidthHeightKendoCom('ComboDataMart2','kendoDropDownList',250,0);
    this. kendoDialogSharedService.setConfigurationKendoDialog('updateDialogMeas',800,500,'Kpi Description');
    this.listBoxMethodService.initializelistBoxComp('listBMataMart','cubeName','cubeName','single', ['remove', 'moveUp', 'moveDown'],
    null,[],null,null);
    this.sharedMethodService.setWidthHeightKendoCom(
      'listBMataMart',
      'kendoListBox',
      300,
      200
    );
  }
  ngOnInit(): void {
    this.olapCubeChoosen=this.sharedMethodService.initializeOlapCubeChoosen();
    this.getServers();
    //this.getDataMarts();
   // this.changeEventDropDown();
    this.FillSelectionDialogInputs();
    this.routerSubscription = this.router.events.subscribe((event) => {
      if (event instanceof NavigationStart) {
        // Close the Kendo UI window when navigating away
        this. kendoDialogSharedService.closeKendoDialog('updateDialogMeas','kendoDialog');

      }
    });
  }
  getServers(){
    this.wizardCubeService.getSqlServersNames().subscribe({
      next: (successResponse) => {
        this.olapCubeChoosen.sqlServerInstance =successResponse[0].nameInstance;
        console.log('creverrrrrrrrrr:',  this.olapCubeChoosen);
        this.getDataMarts();

      },
      error: (errorResponse) => {
        console.log(errorResponse);
      },
    });
  }
 /* changeEventDropDown(){
    this.dropDownMethodService.dropdownChange.subscribe((selectedValue: any) => {
      // Handle dropdown change event here
      if( selectedValue.sender.element[0].id=="ComboDataMart2"){
        var selectedCube=selectedValue.sender._cascadedValue;
        selectedCube==''? this.sharedMethodService.showSnackbar('Please select your dataSource','Error!','') :
        this.destroyGridBeforeClickBtn();
        $('#grid').css('display', '');
        this.GetMeasDescByCubeName(selectedCube);
      }

      this.selectedCube=selectedCube;
      console.log('Dropdown value changed:', selectedCube);
      // Perform operations based on the selectedValue
    });
  }*/
  getDataMarts(){
    this.loadingCube=true;
   // this.olapCubeChoosen.sqlServerInstance = 'DESKTOP-GVOA2DU';
    this.wizardCubeService.getOlapCubesName(this.olapCubeChoosen).subscribe({
      next: (successResponse) => {
       // this.sharedMethodService.populateKendoComponent(successResponse,"ComboDataMart2",'kendoDropDownList');
       var olapCube = this.sharedMethodService.callKendoComponent('listBMataMart', 'kendoListBox');
      this.olapCubeNames=successResponse;
      olapCube.setDataSource(this.olapCubeNames);
        this.loadingCube=false;
      },
      error: (errorResponse) => {
        console.log(errorResponse);
        this.loadingCube=false;
        this.sharedMethodService.showSnackbar('Error contact Admin','Error!','');

      },
    });
  }
  FillSelectionDialogInputs(){
    this. kendoDialogSharedService.FillSelectionDialogInputs.subscribe((dataItem: any) => {
   this.MeasDescription=dataItem.measureDescription;
   this.MeasName=dataItem.measureName;
   //console.log('datatitelm',dataItem);
    });
  }
  destroyGridBeforeClickBtn(){
    var grid= $('#gridmeas-Desc');
    if ( grid && grid.data('kendoGrid')) {
      $('#gridmeas-Desc').data('kendoGrid').destroy();
    }
  }
  GetMeasDescByCubeName() {
    //this.sharedMethodService.destroyComp('gridDim-Desc',false);
   // this.olapCubeChoosen.sqlServerInstance='DESKTOP-GVOA2DU';
   console.log('Dnourayufgyuuuuuuuuuuuuuuuuuuuuuuu',);
   this.olapCubeChoosen.olapCubeName= this.listBoxMethodService.selectedValueListBox('listBMataMart', 'kendoListBox');
  //  this.olapCubeChoosen.olapCubeName=selectedCube;
    this.wizardCubeService.getMeasures(this.olapCubeChoosen).subscribe({
      next: (successResponse) => {
        console.log('kpi Description ', successResponse);
        this.listMeas=successResponse;
        this.destroyGridBeforeClickBtn();
        $('#gridmeas-Desc').css('display', '');
        this.InitializeGrid();
      },
      error: (errorResponse) => {
        console.log(errorResponse);
      },
    });
  }
  prepareColumnGrid(): any[] {
    return [
      { field: 'measureName', title: 'KPI Name' },
      { field: 'measureDescription', title: 'KPI Description' },
      {
        title: 'Actions',
        template:
          "<button class='k-button k-grid-edit'> <i class='fa fa-edit' aria-hidden='true'> </i> &nbsp; Edit</button>",
      },
    ];
  }
  InitializeGrid() {
    $('#gridmeas-Desc')
       .kendoGrid({
        selectable: 'single,row',
         dataSource: {
           data: this.listMeas,
           schema: {
             model: {
              uid: 'id',
               fields: {
                 id: { type: 'string' },
                 measureName: { type: 'string' },
                 measureDescription: { type: 'string' },
               },
             },
           },
         },
         columns: this.prepareColumnGrid(),

         pageable: {
          refresh: false,
          pageSizes: true,
          buttonCount: 5
      },
         //groupable: true,
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

       // handle edit event
       $('#gridmeas-Desc').on('click', '.k-grid-edit', (e: any) => {
       //  $("#updateRportDialog").data("kendoDialog").title("Edit Report");
        this.sharedGridService.selectAutomaticallyRowInGrid(e);
        // this.openDialogEdit();
        this. kendoDialogSharedService.openDialog('updateDialogMeas','gridmeas-Desc','kendoGrid');
       // console.log('im in edit')
       });

   }
   cancelDialog(dialogComp: any) {

    this. kendoDialogSharedService.cancelDialog(dialogComp);
  }
  prepareDataToUpdate(){
    var dataItem=this.sharedGridService.selectedRowGrid('gridmeas-Desc', 'kendoGrid');
    this.MeasDescrToUpdate.id=dataItem.id;
    this.MeasDescrToUpdate.measureDescription=this.MeasDescription;
    this.MeasDescrToUpdate.measureName=dataItem.measureName;

  }
  updateRecord(){
    this.loadingSaveMeasDesc=true;
    this.prepareDataToUpdate();
   var requestMeasure:MeasureToProcessRequest= {
     measToUpdate: this.MeasDescrToUpdate,
     olapCube: this.olapCubeChoosen
   }
   this.wizardCubeService.processMeasureDescription(requestMeasure).subscribe({
    next: (successResponse) => {
      this.loadingSaveMeasDesc=false;
      console.log('isUpdated', successResponse);
      this.cancelDialog("updateDialogMeas");
      if(successResponse==true){

        this.sharedMethodService.showSnackbar('KPI Updated Succefully','Success','succ-snackbar');
        this.GetMeasDescByCubeName();
      }
      else{
        this.sharedMethodService.showSnackbar('Error contact Admin','Error!','');

      }

    },
    error: (errorResponse) => {
      this.loadingSaveMeasDesc=false;
      console.log(errorResponse);
      this.cancelDialog("updateDialogMeas");
      this.sharedMethodService.showSnackbar('Error contact Admin','Error!','');
    },
  })

  }
  displayMeasure(){
    var olapCube =this.listBoxMethodService.selectedValueListBox('listBMataMart', 'kendoListBox');;
    console.log('elected cubeeee',olapCube);
    if(olapCube==''){
      this.showErrorValidationServer();
    }
    else{
      this.GetMeasDescByCubeName();

    }

  }
  showErrorValidationServer() {
    this.controlValidationServerSelected2 = true;
    setTimeout(() => {
      this.controlValidationServerSelected2 = false;
    }, 3000); // 3000 milliseconds (3 seconds)
  }

}
