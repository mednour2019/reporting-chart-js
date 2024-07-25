import { Component, OnInit, AfterViewInit, ViewChild ,ViewEncapsulation,OnDestroy, ElementRef } from '@angular/core';
import { MatRadioChange } from '@angular/material/radio';
import { MatSnackBar,MatSnackBarConfig } from '@angular/material/snack-bar';
import { NavigationStart, Router } from '@angular/router';
import { calculationAttribute } from 'src/app/models/api-model/calculation-cube/cal-attribute.model';
import { CalculationRequest } from 'src/app/models/api-model/calculation-cube/calcul-request.model';
import { columnGrid } from 'src/app/models/api-model/calculation-cube/col-grid.model';
import { existanceCalculation } from 'src/app/models/api-model/calculation-cube/existance-calculation.model';
import { cubeName } from 'src/app/models/api-model/cubename.model';
import { olapCubeChoosen } from 'src/app/models/api-model/olap-cube-choosen.model';
import { server } from 'src/app/models/api-model/server.model';
import { DropDownSharedMethodsService } from 'src/app/services/drop-down-shared-methods/drop-down-shared-methods.service';
import { GridSharedMethodsService } from 'src/app/services/grid-shared-service/grid-shared-methods.service';
import { KendoDialogSharedMethodsService } from 'src/app/services/kendo-dialog-shared-methods/kendo-dialog-shared-methods.service';
import { ListBoxSharedMethodsService } from 'src/app/services/list-box-shared-methods/list-box-shared-methods.service';
import { SharedMethodsService } from 'src/app/services/shared-methods/shared-methods.service';
import { WizardCubeService } from 'src/app/services/wizard-cube/wizard-cube.service';

declare const $: any;
@Component({
  selector: 'app-calculation-interface',
  templateUrl: './calculation-interface.component.html',
  styleUrls: ['./calculation-interface.component.css'],
    encapsulation: ViewEncapsulation.None, // Disable encapsulation

})
export class CalculationInterfaceComponent implements OnInit, AfterViewInit,OnDestroy {
  @ViewChild('myDivElement', { static: false }) myDivElement!: ElementRef;
  @ViewChild('addItem', { static: false }) addItem!: ElementRef;
  @ViewChild('processItem', { static: false }) processItem!: ElementRef;
  filterListBoxOlapCube='';
  classAlertError='k-widget k-tooltip k-tooltip-validation k-invalid-msg';
  classWarningError='k-icon k-i-warning';
  //related about label
  lblDropdownServer='server Instance';
  lblListBoxOlapCubeData='data Source(s)';
  btnDisplayCalc='Display Formula Data';
  btnResetCalc='Reset Formula Data';
  confirmDel='Confirm Delete';
  sureDel='Are you sure you want to delete this record?';
  ////////////////////////
  dropDownSearchLabel = 'Please select server...';
  dropDownSearchLabelKpi = 'Please select Kpi...';
  dropDownSearchLabelformString = 'Please select cal form...';
  loadingServer = false;
  loadingOlapCubeName = false;
  loadingOlapGridCalc=false;
  sqlServersInstance: server[] = [];
  olapCubeNames: cubeName[] = [];
  lblLoadingServer = 'Please wait while retrieving servers...';
  lblLoadingOlapCube = 'Please wait while retrieving data sources...';
  lblLoadingGridCalc='Please wait until load Data...';
  calcDescription='';
  idCalculation='';
  olapCubeChoosen!:olapCubeChoosen /* olapCubeChoosen = {
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
    listHirearchyRows: [],
    InterpretationReport:'',
    colSmartGrid:[]
  };*/
  calculationRequest:calculationAttribute={
    id: '',
    measure1: '',
    measure2: '',
    operation: '',
    calculationName:'',
    formatString :'',
    calculationDecription:'',
    visibility:0
  };
  listCalculationData: calculationAttribute[] = [];
  isDisplay = false;
  private grid: any;
  formulaNameInput: string = '';
  selectedValueRadioBtn: string = '';
  //isDialogVisible: boolean = false;
  isModeAdd = true;
  //listCalcToProcess:calculationAttribute[]=[];
  filterTextOlapCubeDataSource='';
  placeHolderFilter='Filter';
  ///////////////////////////related about notification////
  controlValidationServerSelected=false;
  messageErrorValidationServerSelected='Please select server!';
  controlValidationCubeSelected=false;
  messageErrorValidationCubeSelected='Please select data Source!';
 ctrlValdFormuName=false;
 msgErrorValdFormName='Please enter form Name!';
 ctrlValdKpi1=false;
 msgErrorValdKpi1='Please select kpi1!';
 ctrlValdOp=false;
 msgErrorValdOp='Please check Operation!';
 ctrlValdKPi2=false;
 msgErrorValdKpi2='Please select kpi2!';
 ctrlValdFormString=false;
 msgErrorValdFormString='Please select Formula(s) Form!';
  //////////////////////////////////////////////
  nbKpi :number=0;
  routerSubscription: any;
  olapCubeSelected='';
  constructor(
    private wizardCubeService: WizardCubeService,
    private router: Router,
    private snackbar:MatSnackBar,
    private sharedMethodService: SharedMethodsService,
    private DropDownMethodService:DropDownSharedMethodsService,
    private kendoDialogMethodService:KendoDialogSharedMethodsService,
    private listBoxMethodService:ListBoxSharedMethodsService,
    private kendoGridMethodService:GridSharedMethodsService
  ) {}
  ngOnDestroy(): void {}
  ngOnInit(): void {
    this.olapCubeChoosen=this.sharedMethodService.initializeOlapCubeChoosen();
    this.getSqlServerInstanceMethods();
      // Subscribe to the NavigationStart event of the Router
      this.routerSubscription = this.router.events.subscribe((event) => {
        if (event instanceof NavigationStart) {
          // Close the Kendo UI window when navigating away
          this.kendoDialogMethodService.closeKendoDialog('addDialog','kendoDialog');
          this.kendoDialogMethodService.closeKendoDialog('deleteDialog','kendoDialog');
        //  this.closeKendoDialog('addDialog','kendoDialog');
         // this.closeKendoDialog('deleteDialog','kendoDialog');
        }
      });
      this.changeEventDropDown();
  }

  ngAfterViewInit(): void {

    this.DropDownMethodService.initializeDropDownComp('dropCalc',this.dropDownSearchLabel,'nameInstance','nameInstance');
    this.sharedMethodService.setWidthHeightKendoCom(
      'dropCalc',
      'kendoDropDownList',
      300,
      0
    );
    this.DropDownMethodService.initializeDropDownComp('dropDownKpi1',this.dropDownSearchLabelKpi,'measureName','measureName');
    this.sharedMethodService.setWidthHeightKendoCom(
      'dropDownKpi1',
      'kendoDropDownList',
      300,
      0
    );
    this.DropDownMethodService.initializeDropDownComp('dropDownKpi2',this.dropDownSearchLabelKpi,'measureName','measureName');
    this.sharedMethodService.setWidthHeightKendoCom(
      'dropDownKpi2',
      'kendoDropDownList',
      300,
      0
    );
   this.DropDownMethodService.initializeDropDownComp('formatString',this.dropDownSearchLabelformString,'text','text');
   this.sharedMethodService.setWidthHeightKendoCom(
    'formatString',
    'kendoDropDownList',
    300,
    0
  );
  this.listBoxMethodService.initializelistBoxComp('listCalc','cubeName','cubeName','single', ['remove', 'moveUp', 'moveDown'],
  null,[],null,null);
  this.sharedMethodService.setWidthHeightKendoCom(
    'listCalc',
    'kendoListBox',
    300,
    200
  );
    //var listBoxOlapCube = this.initializelistBoxComp();
    this.kendoDialogMethodService.setConfigurationKendoDialog(
      'addDialog',
      1150,
      600,
      'Add Formula(s)'
    );
    this.kendoDialogMethodService.setConfigurationKendoDialog(
      'deleteDialog',
      500,
      250,
      'Delete Formula(s)'
    );
   // this.setConfigurationKendoDialog('addDialog',600,380);
   // this.setConfigurationKendoDialog('deleteDialog',400,220);
   /* var dropDownServer = this.setWidthHeightKendoCom(
      'listCalc',
      'kendoListBox',
      200,
      200
    );*/
  }
 /* closeKendoDialog(kendoDialogId:any,kendoDialogType:any) {
    var dialogComKendo = $(`#${kendoDialogId}`); // Replace with your window element selector
    if (dialogComKendo && dialogComKendo.data(kendoDialogType)) {
     // $(`#${kendoDialogId}`).data('kendoDialog').close();
      this.callKendoComponent(kendoDialogId,kendoDialogType).close();
      dialogComKendo.data(kendoDialogType).destroy();
    }
  }*/

 /* setConfigurationKendoDialog(compId: any ,width:any,height:any) {
    $(`#${compId}`).kendoDialog({
      visible: false,
      modal: true,
      title: 'Remove Formula(s)', // Set the title
      width: width+'px',
      height:height+'px'

    });
  }*/
 /* checkoptionLabelDropDownList(compId: any): any {
    var optionLabel = '';
    if (compId == 'dropCalc') {
      optionLabel = this.dropDownSearchLabel;
    } else if (compId == 'dropDownKpi2' || compId == 'dropDownKpi1') {
      optionLabel = this.dropDownSearchLabelKpi;
    } else if (compId == 'formatString') {
      optionLabel = this.dropDownSearchLabelformString;
    }
    return optionLabel;
  }*/
 /* checkDataFieldDropDownList(compId: any): any {
    var dataField = '';
    if (compId == 'dropCalc') {
      dataField = 'nameInstance';
    } else if (compId == 'dropDownKpi2' || compId == 'dropDownKpi1') {
      dataField = 'measureName';
    } else if (compId == 'formatString') {
      dataField = 'text';
    }
    return dataField;
  }*/

 /* initializeDropDownComp(compoId: any) {
    $(`#${compoId}`).kendoDropDownList({
      filter: 'contains',
      optionLabel: this.checkoptionLabelDropDownList(compoId),
      dataTextField: this.checkDataFieldDropDownList(compoId),
      dataValueField: this.checkDataFieldDropDownList(compoId),
      change:
        compoId == 'dropCalc' ? this.changeDropDownSqlServer.bind(this) : null,
    });
  }*/
  changeEventDropDown(){
    this.DropDownMethodService.dropdownChange.subscribe((selectedValue: any) => {
      var idDropDown= selectedValue.sender.element[0].id;
      //  console.log('iddropwonnnnnn',idDropDown);
      if (JSON.stringify(idDropDown).includes('dropCalc')) {
        var selectedServer=selectedValue.sender._cascadedValue;
        selectedServer==''?this.listBoxMethodService.emptyKendoListBox('listCalc','kendoListBox'):
         this.callServiceOlapCubes(selectedServer);
      }

    });
  }

  removeItemsListBox(compId: any) {
    var listBox = this.sharedMethodService.callKendoComponent(compId,'kendoListBox');
    listBox.remove(listBox.items());
  }
  destroyComp(){
   // this.removeItemsListBox('listCalc');
    this.destroyGridBeforeClickBtn();
    //$('#grid').remove();
    $('#grid').css('display', 'none');
  }

 /* changeDropDownSqlServer(e: any) {
     var selectedServer=e.sender._cascadedValue;
     selectedServer==''?this.destroyComp():
      this.callServiceOlapCubes(selectedServer);
  }*/
  //call service to get sql servers instance(s)
  getSqlServerInstanceMethods() {
    this.loadingServer = true;
    this.wizardCubeService.getSqlServersNames().subscribe({
      next: (successResponse) => {
        this.loadingServer = false;
        this.sqlServersInstance = successResponse;
        this.updateDataSourceServerSql();
        //  console.log(successResponse);
        this.loadingServer = false;
      },
      error: (errorResponse) => {
        this.loadingServer = false;

        console.log(errorResponse);
        this.loadingServer = false;
      },
    });
  }
  getMeasuresMethods(olapCubeChoosen: olapCubeChoosen) {
    this.wizardCubeService.getMeasures(olapCubeChoosen).subscribe({
      next: (successResponse) => {
        this.updateKpiDropDown(successResponse);
        this.nbKpi=successResponse.length;
        //  console.log("Measures are ",successResponse);
      },
      error: (errorResponse) => {
        console.log(errorResponse);
      },
    });
  }
  updateDataSourceServerSql(): void {
    var dropDownListServ = this.callKendoComponent(
      'dropCalc',
      'kendoDropDownList'
    );
    if (dropDownListServ !== undefined) {
      dropDownListServ.setDataSource(this.sqlServersInstance);
    }
  }
  updateKpiDropDown(listKpi: any[]): void {
    var dropDownkpi1 = this.sharedMethodService.callKendoComponent(
      'dropDownKpi1',
      'kendoDropDownList'
    );
    var dropDownkpi2 = this.sharedMethodService.callKendoComponent(
      'dropDownKpi2',
      'kendoDropDownList'
    );

    if (dropDownkpi1 !== undefined) {
      dropDownkpi1.setDataSource(listKpi);
    }
    if (dropDownkpi2 !== undefined) {
      dropDownkpi2.setDataSource(listKpi);
    }
  }

  /*initializelistBoxComp() {
    $('#listCalc')
      .kendoListBox({
        connectWith: 'connectedListBox',
        selectable: 'single',
        dataTextField: 'cubeName',
        dataValueField: 'cubeName',
        toolbar: {
          tools: ['moveUp', 'moveDown', 'remove'],
        },
      })
      .data('kendoListBox');
  }*/
  callServiceOlapCubes(selectedSqlServer: any) {
    this.loadingOlapCubeName = true;
    this.olapCubeChoosen.sqlServerInstance = selectedSqlServer;
    this.wizardCubeService.getOlapCubesName(this.olapCubeChoosen).subscribe({
      next: (successResponse) => {
        this.loadingOlapCubeName = false;
        this.olapCubeNames = successResponse;
        this.populateOlapCubesListBox();
        // console.log(successResponse);
      },
      error: (errorResponse) => {
        this.loadingOlapCubeName = false;
        console.log(errorResponse);
      },
    });
  }
  callKendoComponent(compId: any, compType: any): any {
    return $(`#${compId}`).data(compType);
  }
  populateOlapCubesListBox(): void {
    var olapCube = this.sharedMethodService.callKendoComponent('listCalc', 'kendoListBox');
    olapCube.setDataSource(this.olapCubeNames);
  }
  destroyGridBeforeClickBtn(){
    var grid= $('#grid');
    if ( grid && grid.data('kendoGrid')) {
      $('#grid').data('kendoGrid').destroy();
    }
  }
  controlValidationServerDataSource():any{
    var validItems=true;
    var selectedDropDownServer = this.DropDownMethodService.selectedValueDropDownList(
      'dropCalc',
      'kendoDropDownList'
    );
    this.olapCubeSelected= this.listBoxMethodService.selectedValueListBox('listCalc', 'kendoListBox');
    if(selectedDropDownServer== ''){
      validItems=false;
      this.showErrorValidationServer();
    }
    if(this.olapCubeSelected== ''){
      validItems=false;
      this.showErrorValidationCube();
    }
    return validItems;
  }
  showCalculationGrid() {
    if(this.controlValidationServerDataSource()){
      this.loadingOlapGridCalc=true;
      var olapCubeSelected = this.listBoxMethodService.selectedValueListBox('listCalc', 'kendoListBox');
      this.olapCubeChoosen.olapCubeName = olapCubeSelected;
      this.wizardCubeService.getCalculationData(this.olapCubeChoosen).subscribe({
        next: (successResponse) => {
          this.listCalculationData = successResponse;
          console.log('succccc',successResponse);
        // Destroy the old grid before initializing a new one
        this.destroyGridBeforeClickBtn();
        $('#grid').css('display', '');
          this.callGridCalc();
          this.loadingOlapGridCalc=false;
        },
        error: (errorResponse) => {
          this.loadingOlapGridCalc=false;
          console.log(errorResponse);
        },
      });
      this.getMeasuresMethods(this.olapCubeChoosen);
      this.loadlistFormatString();
   }
  }
  prepareColumnGrid(): any[] {
    return [
      { field: 'calculationName', title: 'Formulas Name',width: "100px" },
      { field: 'operation', title: 'Operation',width: "100px" },
      { field: 'measure1', title: 'Kpi1',width: "100px" },
      { field: 'measure2', title: 'Kpi2',width: "100px" },
      { field: 'formatString', title: 'Format String',width: "100px" },
      { field: 'calculationDecription', title: 'Formulas description' ,width: "250px"},
      {
        title: 'Actions',
        template:
        this.myDivElement.nativeElement.innerHTML,
        width: "100px"
         //"<button class='k-button k-grid-edit btn-grid'> <i class='fa fa-edit ic-grid' aria-hidden='true'> </i> &nbsp; Edit</button><button class='k-button k-grid-remove btn-grid'><i class='fa fa-trash ic-grid' aria-hidden='true'> </i>&nbsp; Remove</button>",
      },
    ];
  }
  callGridCalc() {
    // Initialize the Grid
   $('#grid')
      .kendoGrid({
        selectable: 'single,row',
        dataSource: {
          data: this.listCalculationData,
          schema: {
            model: {
              uid: 'id',
              fields: {
               id: { type: 'string' },
                measure1: { type: 'string' },
                measure2: { type: 'string' },
                operation: { type: 'string' },
                calculationName: { type: 'string' },
                formatString: { type: 'string' },
                calculationDecription: { type: 'string' },
                visibility: { type: 'number' },
              },
            },
          },
        },
        toolbar: [
          {
            name: 'custom',
            template:this.addItem.nativeElement.innerHTML
          //  "<button class='k-button k-grid-add'> <i class='fa fa-plus ic-grid' aria-hidden='true'> </i>  &nbsp; Add </button>",
          },
          {
            name: 'process',
            template:this.processItem.nativeElement.innerHTML
            //"<button class='k-button k-grid-process btn-process'> <i class='fa fa-cogs ic-grid' aria-hidden='true'> </i>  &nbsp;Process Data </button>",
          },
          {
            name: 'pdf',
          },
          {
            name: 'excel',
          },

        ],
        columns: this.prepareColumnGrid(),
        pageable: {
          refresh: false,
          pageSizes: true,
          buttonCount: 5
      },
      groupable: true,
      filterable: true,
       sortable: true,
       navigatable: true,
       resizable: true,
       reorderable: true,
       columnMenu: true,
       dataBound: this.onDataBoundGrid.bind(this)
      })
      .data('kendoGrid');
     // grid.saveChanges();
    //this.grid = grid;
    //handle add event
    $('#grid').on('click', '.k-grid-add', () => {
      this.isModeAdd = true;
      $("#addDialog").data("kendoDialog").title("Add Formula(s)");
      this.openDialogAdd();
    });
    // handle edit event
    $('#grid').on('click', '.k-grid-edit', (e: any) => {
      this.isModeAdd = false;
     this.kendoGridMethodService.selectAutomaticallyRowInGrid(e);
     $("#addDialog").data("kendoDialog").title("Edit Formula(s)");
      this.openDialogAdd();
    });
    //handle remove event
    $('#grid').on('click', '.k-grid-remove', (e:any) => {
     // this.isModeAdd = 3;
      this.kendoGridMethodService.selectAutomaticallyRowInGrid(e);
      this.openDialogRemove();
    });
     //handle process Data event
     $('#grid').on('click', '.k-grid-process', () => {
      this.processData();
      //console.log('click');
    });
  }
 onDataBoundGrid() {
  var grid = this.sharedMethodService.callKendoComponent('grid', 'kendoGrid');
  var items = grid.dataSource.view();
  for (var i = 0; i < items.length; i++) {
      if (items[i].visibility == 0) {
           var $row = $('#grid').find("[data-uid='"+items[i].uid+"']"); // find grid row by uid
            $row.hide();
        }
    }
}
 /* addCalcGrid(){
     console.log('click');
    this.isModeAdd = true;
    $("#addDialog").data("kendoDialog").title("Add Formula(s)");
    this.openDialogAdd(this.isModeAdd);
  }*/
  /*selectAutomaticallyRowInGrid(e:any){
    var row = $(e.target).closest("tr");
    var grid = row.closest(".k-grid").data("kendoGrid");
    grid.select(row);

  }*/
  // Function to handle radio button changes
  onRadioChange(event: any) {
    this.selectedValueRadioBtn = event.value;
  }
 /* selectedValueDropDownList(compId: any, CompType: any): any {
    var dropDownList = this.callKendoComponent(compId, CompType);
    return dropDownList.value();
  }*/
 /* selectedValueListBox(compId: any, CompType: any): any {
    var listBox = this.callKendoComponent(compId, CompType);
    return listBox.select().text();
  }*/
  getTextRadBtnByVal(): any {
    var operation = '';
    if (parseInt(this.selectedValueRadioBtn) == 1) {
      operation = '+';
    } else if (parseInt(this.selectedValueRadioBtn) == 2) {
      operation = '-';
    } else if (parseInt(this.selectedValueRadioBtn) == 3) {
      operation = '*';
    } else {
      operation = '/';
    }
    return operation;
  }
  getValRadBtnByText(operation: any): any {
    var val = '';
    if (operation == '+') {
      val = '1';
    } else if (operation == '-') {
      val = '2';
    } else if (operation == '*') {
      val = '3';
    } else {
      val = '4';
    }
    return val;
  }
  controlValidationCompDialog():any{
    var validItems=true;
    var selectedKpi1 = this.DropDownMethodService.selectedValueDropDownList(
      'dropDownKpi1',
      'kendoDropDownList'
    );
    var selectedKpi2 = this.DropDownMethodService.selectedValueDropDownList(
      'dropDownKpi2',
      'kendoDropDownList'
    );
    var selectedFormatString = this.DropDownMethodService.selectedValueDropDownList(
      'formatString',
      'kendoDropDownList'
    );
    var checkedOperation= this.selectedValueRadioBtn;
    var enteredFormName=this.formulaNameInput;
    if(selectedKpi1== ''){
      validItems=false;
      this.showErrValdKpi1();
    }
    if(selectedKpi2== ''){
      validItems=false;
      this.showErrValdKpi2();
    }
    if(selectedFormatString== ''){
      validItems=false;
      this.showErrValdFormString();
    }
    if(checkedOperation== ''){
      validItems=false;
      this.showErrValdOper();
    }
    if(enteredFormName== ''){
      validItems=false;
      this.showErrValdFormName();
    }
    return validItems
  }
  saveRecord() {
    if(this.controlValidationCompDialog())
    {
        var calculationName = this.formulaNameInput;
        var selectedDropDownkpi1 = this.DropDownMethodService.selectedValueDropDownList(
          'dropDownKpi1',
          'kendoDropDownList'
        );
        var selectedDropDownkpi2 = this.DropDownMethodService.selectedValueDropDownList(
          'dropDownKpi2',
          'kendoDropDownList'
        );
        var selectedFormString = this.DropDownMethodService.selectedValueDropDownList(
          'formatString',
          'kendoDropDownList'
        );
        var checkedOpRadioBtn = this.getTextRadBtnByVal();
        var calculationDecription=this.calcDescription;
        var grid = this.sharedMethodService.callKendoComponent('grid', 'kendoGrid');
    //  this.calculationRequest.id=this.idCalculation;
    //  this.calculationRequest.measure1=selectedDropDownkpi1;
     // this.calculationRequest.measure2=selectedDropDownkpi2;
     // this.calculationRequest.operation=checkedOpRadioBtn;
      //this.calculationRequest.calculationName=calculationName;
     //this.calculationRequest.formatString=selectedFormString=='Percent'? '"Percent"': selectedFormString
     // this.calculationRequest.calculationDecription=calculationDecription;
        //if (this.isModeAdd == true) {
         /* var requestCalculation:CalculationRequest= {
            calculToProcess:this.calculationRequest,
            olapCalcul:this.olapCubeChoosen,
            isModeAdd:this.isModeAdd

          }*/
      //    this.processCalculationItem(requestCalculation);
      if(this.isModeAdd==true)
      {
        if(!this.checkExistanceGrid(grid,calculationName)){
          grid.dataSource.add({
            // id: lenGrid!=0?lastItem.id + 1:idGrid+1,
            id:calculationName,
             measure1: selectedDropDownkpi1,
             measure2: selectedDropDownkpi2,
             operation: checkedOpRadioBtn,
             calculationName: calculationName,
             formatString: selectedFormString,
             calculationDecription:calculationDecription,
             visibility:1
           });
           this.sharedMethodService.showSnackbar('Data added Succefully','Success','succ-snackbar');


        }
        else{
          this.sharedMethodService.showSnackbar('formula name is exist here  or in old reports !','Error!','');
        }
       // var idGrid=0;
   // var lenGrid= grid.dataSource._data.length;
   // var lastItem =lenGrid!=0?
   //   grid.dataSource._data[grid.dataSource._data.length - 1] :null;


        /*var existCalculation:existanceCalculation= {
          calculationName:calculationName,
          sqlServerInstance:this.olapCubeChoosen.sqlServerInstance,
          olapCubeName:this.olapCubeChoosen.olapCubeName
        }*/
      /*this.checkExistanceCalculationItem(existCalculation,grid,calculationName,selectedDropDownkpi1,
        selectedDropDownkpi2,selectedFormString ,checkedOpRadioBtn,calculationDecription );*/
       // console.log('griiiddddd',grid);
      }

      else {
        var id = grid.dataSource.get(
            grid.dataItem(grid.select()).id
          );
          id.set('measure1', selectedDropDownkpi1);
          id.set('measure2', selectedDropDownkpi2);
          id.set('operation', checkedOpRadioBtn);
          id.set('calculationName', calculationName);
          id.set('formatString', selectedFormString);
          id.set('calculationDecription', calculationDecription);
         // this.sharedMethodService.showSnackbar('Data edited Succefully','Success','succ-snackbar');
         this.sharedMethodService.showSnackbar('Data edited Succefully','Success','succ-snackbar');
        }
        this.kendoDialogMethodService.cancelDialog('addDialog');
       // var stateAction=this.isModeAdd?'Added':'Edited';
     //  var msgSnackBar='Data '+stateAction +' Succefully';
     //  this.sharedMethodService.showSnackbar(msgSnackBar,'Success','succ-snackbar');
      console.log("my gridddddd", grid.dataSource._data);
   }
  }
  checkExistanceGrid(grid:any,calculationName:any):boolean{
    var isExist=false;
    grid.dataSource._data.map(( item:any) => {
     if(item.calculationName===calculationName){
      console.log("itemCAlculaaaa", item.calculationName);
      console.log("itemCAlaINoputt", calculationName);
      isExist=true;
      return;
     }
    });
    return isExist;
  }
  removeRecord() {
   // var  listToProcess: calculationAttribute[]=[];
    var grid = this.sharedMethodService.callKendoComponent('grid', 'kendoGrid');
    var selectedRow = grid.select();
    var dataItem = grid.dataItem(selectedRow);
   // this.calculationRequest.id=dataItem.id.toString();
   // this.calculationRequest.measure1=dataItem.measure1;
    //this.calculationRequest.measure2=dataItem.measure2;
   // this.calculationRequest.operation=dataItem.operation;
   // this.calculationRequest.calculationName=dataItem.calculationName;
   // this.calculationRequest.formatString=dataItem.formatString=='Percent'? '"Percent"': dataItem.formatString
    //this.calculationRequest.calculationDecription=dataItem.calculationDecription;
    //    listToProcess[0]=this.calculationRequest;
     //   var requestCalculation:CalculationRequest= {
     //     listCalculToProcess:listToProcess,
      //    olapCalcul:this.olapCubeChoosen
      //  }
        console.log('dataitemmmm',dataItem);
      //  this.removeCalculationItem(requestCalculation,dataItem,grid);
      dataItem.visibility=0;
      $(selectedRow).hide();

      this.sharedMethodService.showSnackbar('Formula Removed Succefully','Success','succ-snackbar');
      this.cancelDialog("deleteDialog");
     // this.onDataBoundGrid();


  }
 /* removeCalculationItem(requestCalculation:any,dataItem:any,grid:any){
    this.wizardCubeService.removeCalculationData(requestCalculation).subscribe({
      next: (successResponse) => {
       this.cancelDialog("deleteDialog");
       this.loadingOlapGridCalc=true;
        if(successResponse==true){
         this.showCalculationGrid();
         this.sharedMethodService.showSnackbar('Formula Removed Succefully','Success','succ-snackbar');
         this.loadingOlapGridCalc=false;
        }
        else{
         // this.sharedMethodService.showSnackbar('Error contact Admin','Error!','');
         grid.dataSource.remove(dataItem);
         grid.refresh();
         this.sharedMethodService.showSnackbar('Formula Removed Succefully','Success','succ-snackbar');
          this.loadingOlapGridCalc=false;
        }
      },
      error: (errorResponse) => {
        console.log(errorResponse);
        this.sharedMethodService.showSnackbar('Error Please contact Admin','Error!','');
        this.loadingOlapGridCalc=false;
      },
    });
  }*/

 /* checkExistanceCalculationItem(existCalculItem:any,grid:any,calculationName:any,selectedDropDownkpi1:any,
    selectedDropDownkpi2:any,selectedFormString:any,checkedOpRadioBtn:any,calculationDecription:any ){
    this.wizardCubeService.checkExistanceCalculationData(existCalculItem).subscribe({
      next: (successResponse) => {
        if(successResponse==true){
          this.sharedMethodService.showSnackbar('formula name is exist here  or in old reports !','Error!','');
        }
        else{
        this.addNewCalculationGrid(grid,calculationName,selectedDropDownkpi1,selectedDropDownkpi2,selectedFormString
          ,checkedOpRadioBtn,calculationDecription);
          this.sharedMethodService.showSnackbar('Data added Succefully','Success','succ-snackbar');

        }
      },
      error: (errorResponse) => {
        console.log(errorResponse);
        this.sharedMethodService.showSnackbar('Error Please contact Admin','Error!','');
      },
    });
  }*/
  /*addNewCalculationGrid(grid:any,calculationName:any,selectedDropDownkpi1:any,selectedDropDownkpi2:any,selectedFormString:any,
    checkedOpRadioBtn:any,calculationDecription:any){
    var idGrid=0;
    var lenGrid= grid.dataSource._data.length;
    var lastItem =lenGrid!=0?
      grid.dataSource._data[grid.dataSource._data.length - 1] :null;

    grid.dataSource.add({
      id: lenGrid!=0?lastItem.id + 1:idGrid+1,
      measure1: selectedDropDownkpi1,
      measure2: selectedDropDownkpi2,
      operation: checkedOpRadioBtn,
      calculationName: calculationName,
      formatString: selectedFormString,
      calculationDecription:calculationDecription
    });
  }*/
 /* processCalculationItem(requestCalculation:any){
    this.wizardCubeService.processCalculationData(requestCalculation).subscribe({
      next: (successResponse) => {
       // this.listCalculationData = successResponse;
       this.cancelDialog("addDialog");
       this.loadingOlapGridCalc=true;
        if(successResponse==true){
         this.showCalculationGrid();
         this.sharedMethodService.showSnackbar('Formula added Succefully','Success','succ-snackbar');
         this.loadingOlapGridCalc=false;
        }
        else{
          this.sharedMethodService.showSnackbar('Error contact Admin','Error!','');
          this.loadingOlapGridCalc=false;

        }
      },
      error: (errorResponse) => {
        console.log(errorResponse);
        this.sharedMethodService.showSnackbar('Error Please contact Admin','Error!','');
        this.loadingOlapGridCalc=false;
      },
    });
  }*/
  cancelDialog(dialogComp: any) {
    this.kendoDialogMethodService.cancelDialog(dialogComp);
  }
  clearOrFillSelectionDialogInputs(dataItem: any) {
    var dropDownKpi1 = this.sharedMethodService.callKendoComponent(
      'dropDownKpi1',
      'kendoDropDownList'
    );
    var dropDownKpi2 = this.sharedMethodService.callKendoComponent(
      'dropDownKpi2',
      'kendoDropDownList'
    );
    var formatString = this.sharedMethodService.callKendoComponent(
      'formatString',
      'kendoDropDownList'
    );
    this.selectedValueRadioBtn = this.isModeAdd==true
      ? ''
      : this.getValRadBtnByText(dataItem.operation);
    this.formulaNameInput = this.isModeAdd==true ? '' : dataItem.calculationName;
    dropDownKpi1.value(this.isModeAdd==true ? '' : dataItem.measure1);
    dropDownKpi2.value(this.isModeAdd==true ? '' : dataItem.measure2);
    formatString.value(this.isModeAdd ==true? '' : dataItem.formatString);
    this.calcDescription=this.isModeAdd==true ? '':dataItem.calculationDecription;
    this.idCalculation=this.isModeAdd==true ? '':dataItem.id;
  }
  openDialogRemove() {
    var grid = this.sharedMethodService.callKendoComponent('grid', 'kendoGrid');
    var selectedRow = grid.select();
    if (selectedRow.length > 0) {
      this.kendoDialogMethodService.openCenteredDialog('deleteDialog');
    } else {
      console.log('no row selected');
    }
  }
  processData(){
    this.loadingOlapGridCalc=true;
     var  listToProcess: calculationAttribute[]=[];
      var grid = this.sharedMethodService.callKendoComponent('grid', 'kendoGrid');
      grid.refresh();
      var dataCalcu= grid.dataSource._data;
      console.log('datasource grid ',dataCalcu);
      listToProcess =  dataCalcu.map((item: any) => {
        return {
          id: item.id.toString(),
          measure1: item.measure1,
          measure2: item.measure2,
          operation: item.operation,
          calculationName: item.calculationName,
          formatString: item.formatString=='Percent'? '"Percent"': item.formatString,
          calculationDecription:item.calculationDecription,
          visibility:item.visibility
        };
      });
      var requestCalculation:CalculationRequest= {
        listCalculToProcess:listToProcess,
        olapCalcul:this.olapCubeChoosen

      }
      console.log('listToProcess ',requestCalculation);
     // console.log('listToProcess ',olapCalculs);

      this.wizardCubeService.processCalculationData(requestCalculation).subscribe({
        next: (successResponse) => {
          this.listCalculationData = successResponse;
          if(successResponse==true){
           // this.snackbar.open('Data proccess successfully',
           // undefined,{duration:2000})
           // console.log('succc',successResponse);
           this.sharedMethodService.showSnackbar('Data Process Succefully','Success','succ-snackbar');
           this.loadingOlapGridCalc=false;
          }
          else{
            this.sharedMethodService.showSnackbar('Error contact Admin','Error!','');

          }
        },
        error: (errorResponse) => {
          console.log(errorResponse);
          this.sharedMethodService.showSnackbar('Error Please contact Admin','Error!','');
          this.loadingOlapGridCalc=false;
        },
      });


  }
  openDialogAdd() {

    if (this.isModeAdd ==false) {
      var grid = this.sharedMethodService.callKendoComponent('grid', 'kendoGrid');
      var selectedRow = grid.select();
        var dataItem = grid.dataItem(selectedRow);
        this.clearOrFillSelectionDialogInputs(dataItem);
        this.kendoDialogMethodService.openCenteredDialog('addDialog');

    } else {
      this.clearOrFillSelectionDialogInputs({});
      this.kendoDialogMethodService.openCenteredDialog('addDialog');
    }
  }

 /* openCenteredDialog(dlgComp: any) {
    //console.log("sucessedRemove");
    var Dialog = $(`#${dlgComp}`).data('kendoDialog');
    Dialog.open();
  }*/

  /*setWidthHeightKendoCom(compId: any, comType: any, width: any, height: any) {
    var listBox = this.callKendoComponent(compId, comType);
    // Set the width and height
    listBox.wrapper.css({
      width: width + 'px', // Set the desired width
      height: height + 'px', // Set the desired height
    });
  }*/
  prepareDataFormatString(): any[] {
    return [
      { id: 1, text: 'Percent' },
      { id: 2, text: 'Standard' },
      { id: 3, text: 'Currency' },
    ];
  }
  loadlistFormatString() {
    var listFormatString = this.sharedMethodService.callKendoComponent(
      'formatString',
      'kendoDropDownList'
    );
    // Clear the ListBox
    listFormatString.dataSource.data([]);
    // Add column names to the ListBox
    this.prepareDataFormatString().forEach((item) => {
      listFormatString.dataSource.add({ text: item.text });
    });
  }

  /*showSnackbar(message:any,action:any,panelClass:any) {
    // Customize snackbar appearance and behavior
    var config: MatSnackBarConfig = {
      duration: 3000, // Duration in milliseconds
      horizontalPosition: 'right', // 'start' | 'center' | 'end' | 'left' | 'right'
      verticalPosition: 'top', // 'top' | 'bottom'
      panelClass:panelClass,

    };
    this.snackbar.open(message, action, config);

  }*/
  applyFilterOlapCube(){
    var lstBoxOlapCube = this.callKendoComponent('listCalc','kendoListBox');
    var filterValueOlapCube = this.filterTextOlapCubeDataSource.toLowerCase();
    lstBoxOlapCube.dataSource.filter({
      field: 'cubeName',
      operator: 'contains',
      value: filterValueOlapCube,
    });
  }
  showErrorValidationServer() {
    this.controlValidationServerSelected = true;
    setTimeout(() => {
      this.controlValidationServerSelected = false;
    }, 3000); // 3000 milliseconds (3 seconds)
  }
  showErrorValidationCube() {
    this.controlValidationCubeSelected= true;
    setTimeout(() => {
      this.controlValidationCubeSelected = false;
    }, 3000); // 3000 milliseconds (3 seconds)
  }
 /* resetAllComp(){
    this.destroyComp();
    var dropDownServer = this.sharedMethodService.callKendoComponent(
      'dropCalc',
      'kendoDropDownList'
    );
    dropDownServer.value('');

  }*/
  showErrValdKpi1() {
    this.ctrlValdKpi1= true;
    setTimeout(() => {
      this.ctrlValdKpi1 = false;
    }, 3000);
  }
  showErrValdKpi2() {
    this.ctrlValdKPi2= true;
    setTimeout(() => {
      this.ctrlValdKPi2 = false;
    }, 3000);
  }
  showErrValdFormName() {
    this.ctrlValdFormuName= true;
    setTimeout(() => {
      this.ctrlValdFormuName = false;
    }, 3000);
  }
  showErrValdOper() {
    this.ctrlValdOp= true;
    setTimeout(() => {
      this.ctrlValdOp = false;
    }, 3000);
  }
  showErrValdFormString() {
    this.ctrlValdFormString= true;
    setTimeout(() => {
      this.ctrlValdFormString = false;
    }, 3000);
  }




}

