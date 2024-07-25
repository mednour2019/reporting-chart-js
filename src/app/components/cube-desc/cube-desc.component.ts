import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { NavigationStart, Router } from '@angular/router';
import { CubeToProcessRequest } from 'src/app/models/api-model/cube-process-desc.model';
import { cubeName } from 'src/app/models/api-model/cubename.model';
import { olapCubeChoosen } from 'src/app/models/api-model/olap-cube-choosen.model';
import { GridSharedMethodsService } from 'src/app/services/grid-shared-service/grid-shared-methods.service';
import { KendoDialogSharedMethodsService } from 'src/app/services/kendo-dialog-shared-methods/kendo-dialog-shared-methods.service';
import { SharedMethodsService } from 'src/app/services/shared-methods/shared-methods.service';
import { WizardCubeService } from 'src/app/services/wizard-cube/wizard-cube.service';
declare const $: any;
@Component({
  selector: 'app-cube-desc',
  templateUrl: './cube-desc.component.html',
  styleUrls: ['./cube-desc.component.css']
})
export class CubeDescComponent implements OnInit, AfterViewInit, OnDestroy{
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
  routerSubscription: any;
  listCubes!: cubeName[];
  CubeDescription='';
  CubeName='';
  loadingSaveCubeDesc=false;
  lblLoadingSaveDesCube='Please wait while saving Data...!';
  CubeDescrToUpdate:cubeName={
    id: '',
    cubeDescription: '',
    cubeName: '',

  };
  loadingGridCube=false;
  lblloadingGridCube='Please wait while load DataSources';
  constructor( private wizardCubeService: WizardCubeService,
    private sharedMethodService:SharedMethodsService,
    private router: Router,
    private sharedGridService:GridSharedMethodsService,
    private kendoDialogSharedService:KendoDialogSharedMethodsService) {}
  ngOnDestroy(): void {

  }
  ngAfterViewInit(): void {
    this. kendoDialogSharedService.setConfigurationKendoDialog('updateDialogCube',800,500,'DataSource Description');

  }
  ngOnInit(): void {
    this.olapCubeChoosen=this.sharedMethodService.initializeOlapCubeChoosen();
    this.getServers();

    this.FillSelectionDialogInputs();
    this.routerSubscription = this.router.events.subscribe((event) => {
      if (event instanceof NavigationStart) {
        // Close the Kendo UI window when navigating away
        this. kendoDialogSharedService.closeKendoDialog('updateDialogCube','kendoDialog');

      }
    });
  }
  getServers(){
    this.wizardCubeService.getSqlServersNames().subscribe({
      next: (successResponse) => {
        this.olapCubeChoosen.sqlServerInstance =successResponse[0].nameInstance;
        console.log('creverrrrrrrrrr:',  this.olapCubeChoosen);
        this.GetOlapCubes();

      },
      error: (errorResponse) => {
        console.log(errorResponse);
      },
    });
  }
  FillSelectionDialogInputs(){
    this.kendoDialogSharedService.FillSelectionDialogInputs.subscribe((dataItem: any) => {
   this.CubeDescription=dataItem.cubeDescription;
   this.CubeName=dataItem.cubeName;
   //console.log('datatitelm',dataItem);
    });
  }
  destroyGridBeforeClickBtn(){
    var grid= $('#gridcube-Desc');
    if ( grid && grid.data('kendoGrid')) {
      $('#gridcube-Desc').data('kendoGrid').destroy();
    }
  }
  GetOlapCubes(){
    this.loadingGridCube=true;
   // this.olapCubeChoosen.sqlServerInstance='DESKTOP-GVOA2DU';
    this.wizardCubeService.getOlapCubesName(this.olapCubeChoosen).subscribe({
      next: (successResponse) => {
        this.loadingGridCube=false;
        this.listCubes=successResponse;
        this.destroyGridBeforeClickBtn();
        $('#gridcube-Desc').css('display', '');
        this.InitializeGrid();
      },
      error: (errorResponse) => {
        this.loadingGridCube=false;

      },
    });
  }
  InitializeGrid() {
    $('#gridcube-Desc')
       .kendoGrid({
         dataSource: {
           data: this.listCubes,
           schema: {
             model: {
              uid: 'id',
               fields: {
                 id: { type: 'string' },
                 cubeName: { type: 'string' },
                 cubeDescription: { type: 'string' },

               },
             },
           },
         },
         selectable: 'single,row',
         columns: this.prepareColumnGrid(),

         pageable: {
           refresh: false,
           pageSizes: true,
           buttonCount: 5,
         },
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
       $('#gridcube-Desc').on('click', '.k-grid-edit', (e: any) => {
       //  $("#updateRportDialog").data("kendoDialog").title("Edit Report");
        this.sharedGridService.selectAutomaticallyRowInGrid(e);
        // this.openDialogEdit();
        this. kendoDialogSharedService.openDialog('updateDialogCube','gridcube-Desc','kendoGrid');
       // console.log('im in edit')
       });

   }
   prepareColumnGrid(): any[] {
    return [
      { field: 'cubeName', title: 'DataSource Name',width: "100px" },
      { field: 'cubeDescription', title: 'DataSource Description',width: "250px" },
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
    this.loadingSaveCubeDesc=true;
    this.prepareDataToUpdate();
   var requestCube:CubeToProcessRequest= {
     cubeToUpdate: this.CubeDescrToUpdate,
     olapCube: this.olapCubeChoosen
   }
   this.wizardCubeService.processCubeDescription(requestCube).subscribe({
    next: (successResponse) => {
      this.loadingSaveCubeDesc=false;
      console.log('isUpdated', successResponse);
      this.cancelDialog("updateDialogCube");
      if(successResponse==true){

        this.sharedMethodService.showSnackbar('DataSource Updated Succefully','Success','succ-snackbar');
        this.GetOlapCubes();
      }
      else{
        this.sharedMethodService.showSnackbar('Error contact Admin','Error!','');

      }

    },
    error: (errorResponse) => {
      this.loadingSaveCubeDesc=false;
      console.log(errorResponse);
      this.cancelDialog("updateDialogCube");
      this.sharedMethodService.showSnackbar('Error contact Admin','Error!','');
    },
  })

  }
  prepareDataToUpdate(){
    var dataItem=this.sharedGridService.selectedRowGrid('gridcube-Desc', 'kendoGrid');
    this.CubeDescrToUpdate.id=dataItem.id;
    this.CubeDescrToUpdate.cubeDescription=this.CubeDescription;
    this.CubeDescrToUpdate.cubeName=dataItem.measureName;

  }

}
