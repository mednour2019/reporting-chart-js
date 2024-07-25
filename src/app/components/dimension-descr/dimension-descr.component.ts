import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { NavigationStart, Router } from '@angular/router';
import { cubeName } from 'src/app/models/api-model/cubename.model';
import { DimensionToProcessRequest } from 'src/app/models/api-model/dim-process-desc.model';
import { dimension } from 'src/app/models/api-model/dimension.model';
import { olapCubeChoosen } from 'src/app/models/api-model/olap-cube-choosen.model';
import { DropDownSharedMethodsService } from 'src/app/services/drop-down-shared-methods/drop-down-shared-methods.service';
import { GridSharedMethodsService } from 'src/app/services/grid-shared-service/grid-shared-methods.service';
import { KendoDialogSharedMethodsService } from 'src/app/services/kendo-dialog-shared-methods/kendo-dialog-shared-methods.service';
import { ListBoxSharedMethodsService } from 'src/app/services/list-box-shared-methods/list-box-shared-methods.service';
import { SharedMethodsService } from 'src/app/services/shared-methods/shared-methods.service';
import { WizardCubeService } from 'src/app/services/wizard-cube/wizard-cube.service';
declare const $: any;
@Component({
  selector: 'app-dimension-descr',
  templateUrl: './dimension-descr.component.html',
  styleUrls: ['./dimension-descr.component.css']
})
export class DimensionDescrComponent implements OnInit, AfterViewInit, OnDestroy {
  classAlertError='k-widget k-tooltip k-tooltip-validation k-invalid-msg';
  classWarningError='k-icon k-i-warning';
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
  filterListBoxCubeDim='';
  listDimDesc!: dimension[];
  routerSubscription: any;
  DimDescription='';
  DimName='';
  DimDescrToUpdate:dimension={
    id: '',
    dimensionDescription: '',
    dimensionName: '',
    selected: false
  };
  selectedCube='';
  lblDropdownCube='Select Data Source';
  lblLoadingSaveDesDim='please wait while saving Group Descripton';
  lblLoadingCube='please wait while loading data source';
  loadingCube=false;
  loadingSaveDimDesc=false;
  controlValidationServerSelected=false;
  messageErrorValidationServerSelected='please select data source!'
  olapCubeNames: cubeName[] = [];
  constructor(
    private wizardCubeService: WizardCubeService,
    private sharedMethodService:SharedMethodsService,
    private router: Router,
    private dropDownMethodService:DropDownSharedMethodsService,
    private sharedGridService:GridSharedMethodsService,
    private kendoDialogSharedService:KendoDialogSharedMethodsService,
    private listBoxMethodService:ListBoxSharedMethodsService,

  ) {}
  ngOnDestroy(): void {

  }
  ngAfterViewInit(): void {
  //  this.dropDownMethodService. initializeDropDownComp('ComboDataMart',' select Data Source','cubeName','cubeName');
  //  this.sharedMethodService.setWidthHeightKendoCom('ComboDataMart','kendoDropDownList',250,0);
    this.kendoDialogSharedService.setConfigurationKendoDialog('updateDialog',800,500,'Group Description');
    this.listBoxMethodService.initializelistBoxComp('listBDataMart','cubeName','cubeName','single', ['remove', 'moveUp', 'moveDown'],
  null,[],null,null);
  this.sharedMethodService.setWidthHeightKendoCom(
    'listBDataMart',
    'kendoListBox',
    300,
    200
  );
  }
  ngOnInit(): void {
    this.olapCubeChoosen=this.sharedMethodService.initializeOlapCubeChoosen();
    this.getServers();
  //  this.changeEventDropDown();
    this.FillSelectionDialogInputs();
    this.routerSubscription = this.router.events.subscribe((event) => {
      if (event instanceof NavigationStart) {
        // Close the Kendo UI window when navigating away
        this.kendoDialogSharedService.closeKendoDialog('updateDialog','kendoDialog');

      }
    });
  }
/*  changeEventDropDown(){
    this.dropDownMethodService.dropdownChange.subscribe((selectedValue: any) => {
      // Handle dropdown change event here
      console.log("oleeeeeeeeeee",selectedValue.sender.element[0].id);
      if( selectedValue.sender.element[0].id=="ComboDataMart"){
        var selectedCube=selectedValue.sender._cascadedValue;
        selectedCube==''? this.sharedMethodService.showSnackbar('Please select your dataSource','Error!','') :
        this.GetDimensionDescByCubeName();
      }
      //selectedValue.sender.element[0].id
     // var selectedCube=selectedValue.sender._cascadedValue;
    //
      this.selectedCube=selectedCube;
      console.log('Dropdown value changed:', selectedCube);
      // Perform operations based on the selectedValue
    });
  }*/
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
  getDataMarts(){
    this.loadingCube=true;
   // this.olapCubeChoosen.sqlServerInstance = 'DESKTOP-GVOA2DU';
  // console.log('creverrrrr2222222:',  this.olapCubeChoosen);
    this.wizardCubeService.getOlapCubesName(this.olapCubeChoosen).subscribe({
      next: (successResponse) => {
      //  this.sharedMethodService.populateKendoComponent(successResponse,"ComboDataMart",'kendoDropDownList');
      var olapCube = this.sharedMethodService.callKendoComponent('listBDataMart', 'kendoListBox');
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
    this.kendoDialogSharedService.FillSelectionDialogInputs.subscribe((dataItem: any) => {
   this.DimDescription=dataItem.dimensionDescription;
   this.DimName=dataItem.dimensionName;
   //console.log('datatitelm',dataItem);
    });
  }
  destroyGridBeforeClickBtn(){
    var grid= $('#gridDim-Desc');
    if ( grid && grid.data('kendoGrid')) {
      $('#gridDim-Desc').data('kendoGrid').destroy();
    }
  }
  GetDimensionDescByCubeName() {
    //this.sharedMethodService.destroyComp('gridDim-Desc',false);
    //this.olapCubeChoosen.sqlServerInstance='DESKTOP-GVOA2DU';
 //   this.olapCubeChoosen.olapCubeName=selectedCube;
 this.olapCubeChoosen.olapCubeName= this.listBoxMethodService.selectedValueListBox('listBDataMart', 'kendoListBox');
    this.wizardCubeService.getDimensions(this.olapCubeChoosen).subscribe({
      next: (successResponse) => {
        console.log('Dim Description ', successResponse);
        this.listDimDesc=successResponse;
        this.destroyGridBeforeClickBtn();
        $('#gridDim-Desc').css('display', '');
        this.InitializeGrid();
      },
      error: (errorResponse) => {
        console.log(errorResponse);
      },
    });
  }
  InitializeGrid() {
    $('#gridDim-Desc')
       .kendoGrid({
         dataSource: {
           data: this.listDimDesc,
           schema: {
             model: {
              uid: 'id',
               fields: {
                 id: { type: 'string' },
                 dimensionName: { type: 'string' },
                 dimensionDescription: { type: 'string' },

               },
             },
           },
         },
         selectable: 'row',
         columns: this.prepareColumnGrid(),

         pageable: {
           refresh: false,
           pageSizes: true,
           buttonCount: 5,
         },
        // groupable: true,
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
       $('#gridDim-Desc').on('click', '.k-grid-edit', (e: any) => {
       //  $("#updateRportDialog").data("kendoDialog").title("Edit Report");
        this.sharedGridService.selectAutomaticallyRowInGrid(e);
        // this.openDialogEdit();
        this.kendoDialogSharedService.openDialog('updateDialog','gridDim-Desc','kendoGrid');
       // console.log('im in edit')
       });

   }
   prepareColumnGrid(): any[] {
    return [
      { field: 'dimensionName', title: 'Group Name',width: "100px" },
      { field: 'dimensionDescription', title: 'Group Description',width: "250px" },
      {
        title: 'Actions',
        template:
          "<button class='k-button k-grid-edit'> <i class='fa fa-edit' aria-hidden='true'> </i> &nbsp; Edit</button>",
          width: "100px"
      },
    ];
  }

  cancelDialog(dialogComp: any) {

    this.kendoDialogSharedService.cancelDialog(dialogComp);
  }
  updateRecord(){
   /* var grid = this.sharedMethodService.callKendoComponent('gridDim-Desc', 'kendoGrid');
    var id = grid.dataSource.get(
      grid.dataItem(grid.select()).id
    );*/

   // id.set('dimensionDescription', this.DimDescription);
   this.loadingSaveDimDesc=true;
   this.prepareDataToUpdate();
   var requestCalculation:DimensionToProcessRequest= {
     dimToUpdate: this.DimDescrToUpdate,
     olapCube: this.olapCubeChoosen
   }
   this.wizardCubeService.processDimensionDescription(requestCalculation).subscribe({
    next: (successResponse) => {
      console.log('isUpdated', successResponse);
      this.cancelDialog("updateDialog");
      this.loadingSaveDimDesc=false;
      if(successResponse==true){

        this.sharedMethodService.showSnackbar('Group Updated Succefully','Success','succ-snackbar');
        this.GetDimensionDescByCubeName();
      }
      else{
        this.sharedMethodService.showSnackbar('Error contact Admin','Error!','');

      }

    },
    error: (errorResponse) => {
      this.loadingSaveDimDesc=false;
      console.log(errorResponse);
      this.cancelDialog("updateDialog");
      this.sharedMethodService.showSnackbar('Error contact Admin','Error!','');
    },
  })

  }
  prepareDataToUpdate(){
    var dataItem=this.sharedGridService.selectedRowGrid('gridDim-Desc', 'kendoGrid');
    /*this.DimDescrToUpdate  = {
      id: dataItem.id,
      dimensionDescription: dataItem.dimensionDescription,
      dimensionName: dataItem.dimensionName
    };*/
    console.log('data titem',dataItem);
    console.log('dimensiondescription',this.DimDescrToUpdate);
    this.DimDescrToUpdate.id=dataItem.id;
    this.DimDescrToUpdate.dimensionDescription=this.DimDescription;
    this.DimDescrToUpdate.dimensionName=dataItem.dimensionName;

  }
  displayDimension(){
    var olapCube =this.listBoxMethodService.selectedValueListBox('listBDataMart', 'kendoListBox');;
    console.log('elected cubeeee',olapCube);
    if(olapCube==''){
      this.showErrorValidationServer();
    }
    else{
      this.GetDimensionDescByCubeName();

    }
  }
  showErrorValidationServer() {
    this.controlValidationServerSelected = true;
    setTimeout(() => {
      this.controlValidationServerSelected = false;
    }, 3000); // 3000 milliseconds (3 seconds)
  }
}
