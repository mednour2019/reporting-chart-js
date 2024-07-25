import {
  Component,
  OnInit,
  AfterViewInit,
  Renderer2,
  Input,
  Output,
  EventEmitter,
  ViewChild,
  TemplateRef

} from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { server } from 'src/app/models/api-model/server.model';
import { WizardCubeService } from 'src/app/services/wizard-cube/wizard-cube.service';
import { MatTableDataSource } from '@angular/material/table';
import { olapCubeChoosen } from 'src/app/models/api-model/olap-cube-choosen.model';
import { cubeName } from 'src/app/models/api-model/cubename.model';
import { measure } from 'src/app/models/api-model/measure.model';
import { dimension } from 'src/app/models/api-model/dimension.model';
import { calculation } from 'src/app/models/api-model/calculation.model';
import { ActivatedRoute, NavigationStart, Router, TitleStrategy } from '@angular/router';
import { SharedService } from 'src/app/services/shared/shared.service';
import { ApplicationUser} from 'src/app/models/api-model/authentication/ApplicationUser';
import { UserService } from 'src/app/services/user/user.service';
import { first } from 'rxjs';
import { MatStep, MatStepper } from '@angular/material/stepper';
import { StepperSelectionEvent } from '@angular/cdk/stepper';
import { GenericCheckboxgroupComponent } from '../generic-checkboxgroup/generic-checkboxgroup.component';
import { SharedApiMethodsService } from 'src/app/services/shared-api-methods/shared-api-methods.service';
import { SharedMethodsService } from 'src/app/services/shared-methods/shared-methods.service';
import { ListBoxSharedMethodsService } from 'src/app/services/list-box-shared-methods/list-box-shared-methods.service';
import { DropDownSharedMethodsService } from 'src/app/services/drop-down-shared-methods/drop-down-shared-methods.service';
import { calculationAttribute } from 'src/app/models/api-model/calculation-cube/cal-attribute.model';
import { KendoDialogSharedMethodsService } from 'src/app/services/kendo-dialog-shared-methods/kendo-dialog-shared-methods.service';
declare const $: any;

@Component({
  selector: 'app-wizard-cube',
  templateUrl: './wizard-cube.component.html',

  styleUrls: ['./wizard-cube.component.css'],
})
export class WizardCubeComponent implements OnInit, AfterViewInit {
  sqlServersInstance: server[] = [];
  olapCubeNames: cubeName[] = [];
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

  filterTextOlapCube: string = '';

  //***  related about checkbox group dimensions , measures and Calculations*/

  selectedMeasureCount: number = 0;
  selectedDimensionCount: number = 0;
  selectedCalculCount: number = 0;
  listMeasures!: measure[];
  filteredMeasuresCheckBoxGroup: measure[] = [];
  attributeMeasureClass: string = 'measureName';
  labelItemMeasureShowing: string = 'KPI(s)';
  listDimensions!: dimension[];
  filteredDimensionsCheckBoxGroup: dimension[] = [];
  attributeDimensionClass: string = 'dimensionName';
  labelItemDimensionShowing: string = 'Group(s)';
  listCalculations!: calculationAttribute[];
  filteredCalculationsCheckBoxGroup: calculationAttribute[] = [];
  attributeCalculationClass: string = 'calculationName';
  labelItemCalculationShowing: string = 'Formula(s)';
  iconMeasure: string = 'fa fa-signal';
  iconCalculation: string = 'fa fa-industry';
  iconDimension: string = 'fa fa-cubes';
  checkedItemsDim: any[] = [];
  checkedItemsMeas: any[]=[];
  checkedItemsCalc: any[] = [];


  ///***** *****************************************************/
  // related about wizard configuration

  isLinear = true;
  firstFormGroup!: FormGroup;
  secondFormGroup!: FormGroup;
  msgError: string = '';
  // loading for spinner
  loadingServer = false;
  loadingOlapCubeName=false;
  loadingKPICal=false;
  // Create a reference to the stepper
  @ViewChild('stepper') stepper!: MatStepper;
  controlValidationMeasure = false;
  controlValidationDimension = false;
  controlValidationPreviousSteps = false;
  messageErrorValidationMeasure = 'Please select an option from KPI list!';
  messageErrorValidationDimension = 'Please select an option from Group list!';
  messageErrorValidationPrevSteps = 'Please Verify other Previous Steps!';
  ////////////////////////////////////
  ///////////// related about label showing/////////////////////
  lblCardTitle='Welcome to Consulting Wizard configuration, let'+'s choose datasource(s),KPI(s)...etc';
  lblWizardServer='Choose Server';
  lblDropdownServer='Server(s) Instance(s)';
  lblLoadingServer='Please wait while retrieving servers...';
  lblButtonNext='NEXT';
  lblButtonBack='BACK';
  lblButtonReset='RESET';
  lblButtonDone='DONE';
  lblWizardOlapCube='Choose Data Source';
  placeHolderFilter='FILTER';
  lblListBoxOlapCube='Data Source(s) Available(s)';
  lblLoadingOlapCube='Please wait while retrieving data sources...';
  lblWizardKPI='Choose KPI,Finan Analys..';
  lblLoadingKPICalc='Please wait while retrieving Data..';
  footerTitlaCard='Please click NEXT to progress through all required steps.';
  confirmDialogTitle='Confirm Your Selection';
  dialogLabelKpi='KPI(s) selected:';
  dialogLabelDimension='Group(s) selected:';
  dialogLabelCalc='Formula(s) selected:'
  dropDownSearchLabel='Please select server...'
  titleDialog='Summary Choose Content'
  oKButtonText='OK';
  CancelButtonText='CANCEL'
  msgErrorDropDown='Please select an option from the list.';
  msgErrorListBox='Please select an option from the list.'
  //////////////////////////////////////////////////////////
  routerSubscription: any;
  constructor(
    private _formBuilder: FormBuilder,
    private wizardCubeService: WizardCubeService,
    private renderer: Renderer2,
    private readonly route: ActivatedRoute,
    private router: Router,
    private sharedService: SharedService,
    private userService: UserService,
    private sharedMethodService:SharedMethodsService,
    private listBoxMethodService:ListBoxSharedMethodsService,
    private DropDownMethodService:DropDownSharedMethodsService,
    private kendoDialogSharedService: KendoDialogSharedMethodsService



  ) {}
  ngOnDestroy(): void {}

  ngOnInit(): void {
    this.olapCubeChoosen=this.sharedMethodService.initializeOlapCubeChoosen();
    this.prepParamStepper();

    this.getSqlServerInstanceMethods();
    this.changeEventListBox();
    this.changeEventDropDown();
    this.routerSubscription = this.router.events.subscribe((event) => {
      if (event instanceof NavigationStart) {
        // Close the Kendo UI window when navigating away
        this.kendoDialogSharedService.closeKendoDialog(
          'dialog-summu',
          'kendoDialog'
        );

      }
    });
  }
  ngAfterViewInit(): void {

   // var dropDownListServ = this.initializeDropDownComp();
    this.DropDownMethodService.initializeDropDownComp('dropdownListSqlServer',this.dropDownSearchLabel,'nameInstance','nameInstance');
    // var listBoxOlapCube= this.initializelistBoxComp();
     this.listBoxMethodService.initializelistBoxComp('listBoxOlapCube','cubeName','cubeName','single', ['remove', 'moveUp', 'moveDown'],
     null,[],null,null);
     this.sharedMethodService.setWidthHeightKendoCom('listBoxOlapCube','kendoListBox',250,250);
     this.sharedMethodService.setWidthHeightKendoCom('dropdownListSqlServer','kendoDropDownList',300,0);
     this.kendoDialogSharedService.setConfigurationKendoDialog(
      'dialog-summu',
      900,
      500,
      this.titleDialog
    );

   }
   cancelDialog(dialogComp: any) {
    this.kendoDialogSharedService.cancelDialog(dialogComp);
  }
   changeEventListBox(){
    this.listBoxMethodService.listBoxChange.subscribe((selectedValue: any) => {
      var idListBox= selectedValue.sender.element[0].id;
      //  console.log('iddropwonnnnnn',idDropDown);
      if (JSON.stringify(idListBox).includes('listBoxOlapCube')) {
        this.isLinear = false;
      }

    });
   }
   changeEventDropDown(){
    this.DropDownMethodService.dropdownChange.subscribe((selectedValue: any) => {
      var idDropDown= selectedValue.sender.element[0].id;
        console.log('iddropwonnnnnn',selectedValue);
      if (JSON.stringify(idDropDown).includes('dropdownListSqlServer')) {
        var value = selectedValue.sender.selectedIndex;
        if (value == 0) {
          this.isLinear = true;
        } else {
          this.isLinear = false;
        }
      }

    });
  }
  //fix stepper wizard
  prepParamStepper() {
    this.firstFormGroup = this._formBuilder.group({
      firstCtrl: ['', Validators.required],
      lastCtrl: ['', Validators.required],
    });
    this.secondFormGroup = this._formBuilder.group({
      secondCtrl: ['', Validators.required],
    });
  }
  //call service to get sql servers instance(s)
  getSqlServerInstanceMethods() {
    this.loadingServer= true;
    this.wizardCubeService.getSqlServersNames().subscribe({
      next: (successResponse) => {
        this.loadingServer = false;
        this.sqlServersInstance = successResponse;
        this.updateDataSourceServerSql();
        console.log(successResponse);
      },
      error: (errorResponse) => {
        this.loadingServer = false;

        console.log(errorResponse);
      },
    });
  }


  // Initialize the Kendo Dialog
 /* showSummaryDialog() {
    console.log('checked item call',this.checkedItemsCalc);
    console.log('checked item meaa',this.checkedItemsMeas);
    console.log('checked item meaa',this.checkedItemsDim);


    const dialog =   $('#dialog').kendoDialog({
      width: '550px',
      height: '400px',
      title: this.titleDialog,
      content:'', //$('#dialogContent').html(),
      visible: false, // Initially hide the dialog
      modal: true, // Make it a modal dialog
      closable: true, // Allow users to close the dialog
      actions: [
        {
          text: ' <i class="fas fa-check"></i>'+this.oKButtonText,
          primary: true, // Indicates the primary action (e.g., Enter key)
          action:this.okDialog.bind(this)
        },
        {
          text: ' <i class="fas fa-times"></i>'+this.CancelButtonText,
          action: function (e: any) {
            // Handle Cancel button click here
            $('#dialog').data('kendoDialog').close();
          },
        },
      ],
    }).data('kendoDialog');
     // Reset the content to empty
  dialog.content('');

  // Load new HTML content into the Dialog
  dialog.content($('#dialogContent').html());

  // Show the Dialog
  dialog.open();
  }*/
 /* okDialog(e:any){
    $('#dialog').data('kendoDialog').close();
    this.olapCubeChoosen.olapCubeDimensions = this.checkedItemsDim.map((item:any) => ( item.dimensionName ));
    this.olapCubeChoosen.olapCubeMeasures = this.checkedItemsMeas.map((item:any) => ( item.measureName ));
    this.olapCubeChoosen.olapCubeCalculations = this.checkedItemsCalc;
    console.log(this.olapCubeChoosen.olapCubeMeasures)
    console.log(this.olapCubeChoosen.olapCubeDimensions)
    this.sharedService.setCubeOlapChoosen(this.olapCubeChoosen);
   // this.router.navigateByUrl('/prepData');
    this.router.navigate(['dashboard/prepData']);
  }*/
  redirectConfig(){
    this.kendoDialogSharedService.closeKendoDialog(
      'dialog-summu',
      'kendoDialog'
    );
    this.olapCubeChoosen.olapCubeDimensions = this.checkedItemsDim.map((item:any) => ( item.dimensionName ));
    this.olapCubeChoosen.olapCubeMeasures = this.checkedItemsMeas.map((item:any) => ( item.measureName ));
    this.olapCubeChoosen.olapCubeCalculations = this.checkedItemsCalc;
    console.log(this.olapCubeChoosen.olapCubeMeasures)
    console.log(this.olapCubeChoosen.olapCubeDimensions)
    this.sharedService.setCubeOlapChoosen(this.olapCubeChoosen);
    this.router.navigate(['dashboard/prepData']);

  }
  //initialize drop down component
 /* initializeDropDownComp():any {
 var dopDown=   $('#dropdownListSqlServer').kendoDropDownList({
      filter: 'contains',
      optionLabel: this.dropDownSearchLabel,
      dataTextField: 'nameInstance',
      dataValueField: 'nameInstance',
      change: this.changeDropDownSqlServer.bind(this),
    });
    return dopDown;
  }*/
  // initialize listbox component
  /*initializelistBoxComp():any {
  var listBox=  $('#listBoxOlapCube')
      .kendoListBox({
        connectWith: 'connectedListBox',
        selectable: 'single',
        dataTextField: 'cubeName',
        dataValueField: 'cubeName',
        toolbar: {
          tools: ['moveUp', 'moveDown', 'remove'],
        },
        change: this.changeListBoxOlapCube.bind(this),
      })
      .data('kendoListBox');
      return listBox;
  }*/
  // change metod listbox component
 /* changeListBoxOlapCube(e: any) {
    this.isLinear = false;
  }*/
  //change method frop down component
 /* changeDropDownSqlServer(e: any) {
    var value = e.sender.selectedIndex;
    if (value == 0) {
      this.isLinear = true;
    } else {
      this.isLinear = false;
    }
  }*/
  // validate control saisie drop down component
  validatorDropDown(): any {
    this.msgError = this.msgErrorDropDown;
    var validator = $('#formServInsId').kendoValidator().data('kendoValidator');
    validator.options.rules.requiredDropdown = function (input: any) {
      // Validate if the DropDownList has a value selected
      return input.is('select') && input.val() !== '';
    };
    validator.options.messages.requiredDropdown = this.msgError;
    return validator;
  }
  // call validator and get olap cubes names from service
  getOlapCubesName(): void {
    var validator = this.validatorDropDown().bind(this);
    if (validator.validate()) {
      // Form is valid, proceed with submission
      this.olapCubeChoosen.sqlServerInstance = $('#dropdownListSqlServer')
        .data('kendoDropDownList')
        .value();
      if (this.olapCubeChoosen.sqlServerInstance != '') {
        this.callServiceOlapCubes();
      }
    }
  }
  // calls ervice too get cubes names
  callServiceOlapCubes() {
    this.loadingOlapCubeName = true;
    this.wizardCubeService.getOlapCubesName(this.olapCubeChoosen).subscribe({
      next: (successResponse) => {
        this.loadingOlapCubeName = false;
        this.olapCubeNames = successResponse;
        this.populateOlapCubesListBox();
        console.log(successResponse);
      },
      error: (errorResponse) => {
        this.loadingOlapCubeName = false;
        console.log(errorResponse);
      },
    });
  }
  //validator list box componnet
  validatorListBox() {
    // Initialize the validator
    $('#listBoxOlapCube').kendoValidator({
      rules: {
        requiredListBox: function (input: any) {
          // Validate if the ListBox has a value selected
          return (
            input.is('[name=listBoxOlapCube]') &&
            $('#listBoxOlapCube').data('kendoListBox').select().length > 0
          );
        },
      },
      messages: {
        requiredListBox: this.msgErrorListBox,
      },
    });
  }
  // get dimension/measures/calculation after choosen olap cube
  getMeasDimCalc(): void {
    this.validatorListBox();

    var validator = $('#listBoxOlapCube').data('kendoValidator');
    if (validator.validate()) {
      // this.isLinear=false;
      // Valid, proceed with your action
      this.olapCubeChoosen.olapCubeName = $('#listBoxOlapCube')
        .data('kendoListBox')
        .select()
        .text();
      this.callServiceGetMeasDimCal();
    }
  }
  //call service wizard to get measureq dimensions calculations
  callServiceGetMeasDimCal() {
    this.loadingKPICal = true;
    this.wizardCubeService.getMeasDimCalc(this.olapCubeChoosen).subscribe({
      next: (successResponse) => {

        this.loadingKPICal = false;

        this.listMeasures = successResponse.listMeasures;
        this.filteredMeasuresCheckBoxGroup = this.listMeasures;
        this.listDimensions = successResponse.listDimensions;
        this.filteredDimensionsCheckBoxGroup = this.listDimensions;
        this.listCalculations = successResponse.listCalculations;
        this.filteredCalculationsCheckBoxGroup =
          successResponse.listCalculations;
          console.log( 'calculationn littttttt', this.listCalculations );
      },
      error: (errorResponse) => {
        this.loadingKPICal = false;
        console.log(errorResponse);
      },
    });
  }

  // update dropdow list sql server after page is charged
  updateDataSourceServerSql(): void {
    var dropdownServerSql = $('#dropdownListSqlServer').data(
      'kendoDropDownList'
    );
    if(dropdownServerSql!==undefined){
      dropdownServerSql.setDataSource(this.sqlServersInstance);

    }
  }
  //update listbox cube olap after component loaded
  populateOlapCubesListBox(): void {
    var olapCube = $('#listBoxOlapCube').data('kendoListBox');
    olapCube.setDataSource(this.olapCubeNames);
  }

  // apply filter input on olapcube listbox component
  applyFilterOlapCube() {
    var lstBoxOlapCube = $('#listBoxOlapCube').data('kendoListBox');
    var filterValueOlapCube = this.filterTextOlapCube.toLowerCase();
    lstBoxOlapCube.dataSource.filter({
      field: 'cubeName',
      operator: 'contains',
      value: filterValueOlapCube,
    });
  }

  // Function to show the validation message Measure and set a timer to hide it
  showValidationMessageMeasure() {
    this.controlValidationMeasure = true;
    setTimeout(() => {
      this.controlValidationMeasure = false;
    }, 3000); // 3000 milliseconds (3 seconds)
  }
  // Function to show the validation message Dimension and set a timer to hide it
  showValidationMessageDimension() {
    this.controlValidationDimension = true;
    setTimeout(() => {
      this.controlValidationDimension = false;
    }, 3000); // 3000 milliseconds (3 seconds)
  }
  // more security and verification of previous steeper choose
  showValidationPreviousStep() {
    this.controlValidationPreviousSteps = true;
    setTimeout(() => {
      this.controlValidationPreviousSteps = false;
    }, 3000); // 3000 milliseconds (3 seconds)
  }

  // button done wizard if done navigate to onfiguration olap
  goToSmartConfigGrid() {
    var olapCubeSelected = $('#listBoxOlapCube')
      .data('kendoListBox')
      .select()
      .text();
    var serverSelected = $('#dropdownListSqlServer')
      .data('kendoDropDownList')
      .value();
    if (this.checkedItemsMeas.length == 0 && this.checkedItemsCalc.length == 0 ) {
      this.showValidationMessageMeasure(); // Call the showValidationMessage() method
    } else if (this.checkedItemsDim.length == 0) {
      this.showValidationMessageDimension(); // Call the showValidationMessage() method
    } else if (olapCubeSelected == '' || serverSelected == '') {
      this.showValidationPreviousStep();
    } // All things is right
    else if (
      this.selectedDimensionCount != 0 &&
      ( this.selectedMeasureCount != 0 || this.selectedCalculCount != 0 ) &&
      olapCubeSelected != '' &&
      serverSelected != ''
    ) {
      this.controlValidationDimension = false;
      this.controlValidationMeasure = false;
      this.controlValidationPreviousSteps = false;
      //console.log('always true');
      //console.log(this.checkedItemsMeas[0]);
      // Open the Kendo Dialog
      // this.testMeas=this.checkedItemsMeas;
      //  this.aaaa=this.checkedItemsMeas[0];
      console.log(this.checkedItemsMeas);
      console.log(this.checkedItemsDim);

     // this.showSummaryDialog();
     this.kendoDialogSharedService.openCenteredDialog('dialog-summu');

      //$('#dialog').data('kendoDialog').open();
    }

    /* else if (this.selectedMeasureCount != 0) {
      this.controlValidationMeasure = false;
    }*/



  }

  // on back button click set iisliniair to false
  disableLineair() {

    this.isLinear = false;
  }
  // step mat design to get control saisie and know in which step im in
  onStepSelectionChange(event: any) {
    console.log(event);

    if (event.selectedIndex == 1 && event.previouslySelectedIndex == 0) {
      this.isLinear = true;
    }

    if (event.selectedIndex == 1 && event.previouslySelectedIndex == 2) {
      this.isLinear = false;
    }
  }
  handleNextClick() {




  }
}


