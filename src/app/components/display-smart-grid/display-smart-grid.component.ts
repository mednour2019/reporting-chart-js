import {
  Component,
  OnInit,
  AfterViewInit,
  Input,
  Output,
  EventEmitter,
  NgModule,
  OnDestroy,
  ViewChild,
  ElementRef,
  ViewEncapsulation,
  ViewContainerRef,
} from '@angular/core';
import { NgModel } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import {
  ActivatedRoute,
  Router,
  NavigationStart,
  TitleStrategy,
  NavigationEnd
} from '@angular/router';
import { filter } from 'rxjs/operators';
import { WizardCubeService } from 'src/app/services/wizard-cube/wizard-cube.service';
import { SharedService } from 'src/app/services/shared/shared.service';
import { olapCubeChoosen } from 'src/app/models/api-model/olap-cube-choosen.model';
import { colsmartgrid } from 'src/app/models/api-model/colsmartgrid.model';
import { AnyCatcher } from 'rxjs/internal/AnyCatcher';
import { AddReportRequest } from 'src/app/models/api-model/Report/AddReportRequest.model';
import { ReportOlapService } from 'src/app/services/report-olap/report-olap.service';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { hierarchyRow } from 'src/app/models/api-model/hierarchyRow.model';
import { DataSource } from '@angular/cdk/collections';
import { KendoDialogSharedMethodsService } from 'src/app/services/kendo-dialog-shared-methods/kendo-dialog-shared-methods.service';
import { SharedMethodsService } from 'src/app/services/shared-methods/shared-methods.service';
import { ListBoxSharedMethodsService } from 'src/app/services/list-box-shared-methods/list-box-shared-methods.service';
import { KendoChartService } from 'src/app/services/kendo-chart/kendo-chart.service';
import { AlertErrorComponent } from '../alert-error/alert-error.component';
import { DropDownSharedMethodsService } from 'src/app/services/drop-down-shared-methods/drop-down-shared-methods.service';

declare const $: any;
declare const kendo: any; // Declare kendo to avoid TypeScript errors

@Component({
  selector: 'app-display-smart-grid',
  templateUrl: './display-smart-grid.component.html',
  styleUrls: ['./display-smart-grid.component.css'],
})
export class DisplaySmartGridComponent
  implements OnInit, AfterViewInit, OnDestroy
{
  // related abour router
 // fromReportComponent: boolean = false;
  disableButton: boolean=false;
  controlDisableBtn=false;
  messageErrorReport = 'Report is already saved!';


  ////////
  @ViewChild(AlertErrorComponent) alertErrorComponent!: AlertErrorComponent;
  @ViewChild('myDivElement', { static: false }) myDivElement!: ElementRef;
  /// related about chart configuration
  titleChartEditedInput: string = '';
  isShowValChart: boolean = false;
  newChartContainer: any = '';


  ////////////////////////////////////////
  classAlert = 'k-widget k-tooltip k-tooltip-info';
  classWarning = 'k-icon k-i-info';
  classAlertError='k-widget k-tooltip k-tooltip-validation k-invalid-msg';
  classWarningError='k-icon k-i-warning';
  // related about pdffff downloadd ///////////////////
  listRowInPdf: any[] = [];
  listcolPdf: any[] = [];
  listFilterPdf: any[] = [];
  listKpiPdf: any[] = [];
  //********************************************* */
  olapCubeChoosen!: olapCubeChoosen;
  listMdx: any[] = [];
  listColGrid: colsmartgrid[] = [];
  listHieaRow: hierarchyRow[] = [];
  /////filterArea///////////
  filterListBoxHirarchyRows: string = '';
  filterListBoxKpi: string = '';
  filterListBoxCateg: string = '';
  nbChart = 10;
  filterListFirstLevel: string = '';
  filterListSecondLevel: string = '';
  filterListThirdLevel: string = '';
  //////////////////////////////
  ////////////label area////
  labelKPI = 'Kpi(s)';
  filterInputPlaceHolder = 'Filter';
  labelCategory = ' Category Level1';
  labelChart = 'Charts';
  titleKendoWindow = 'Advanced Filtering by Category Level';
  //labelFirstLevel = 'First Level: ';
  nbFirstLevel = 0;
  //labelSecondLevel = 'Second Level: ';
  //labelThirdLevel = 'Third Level: ';
  nbSecondLevel = 0;
  nbThirdLevel = 0;
  labelRecl = 'please click on level number after select categories!';
  labelAtt = 'number of Attribute(s) ';
  /////////////////////
  /////////////loading span/////

  ///////////////////////
  //////notification and error
  controlNumberKpi = false;
  controlAdvancedReportLevel = false;
  messageErrorKpi = 'Please select kpi!';
  messageErrorAdvancedReportLevel =
    'please your select items in advanced level is empty';
    mesErrLengthData = ' category items is > 50 try to minimize it!';
    controlErrLengthData=false;
  ////////////////////////////////
  reportNameInput: string = '';
  windowIsClosed = true; // Initialize the flag
  routerSubscription: any;
  reportInterpInput: string = '';
  isShareable: boolean = false;
  ctrlValdRepName = false;
  msgErrorValdRepName = 'please enter Report Name';
  ctrlValdRepInterp = false;
  msgErrorValdRepInterp = 'please enter Report Interpretation';
  lblLoadingSaveReport = 'please wait until save report!....';
  loadingReport = false;
  lblloadingGrid = 'please wait until save report!....';
  loadingGrid = false;
  // related about report***************
  report!: AddReportRequest /*= {
    ReportName: '',
    InterpretationReport: '',
    isSharebale: 0,
    sqlServerInstance: '',
    olapCubeName: '',
    measCalChoosen: '',
    attribRowsFormatReport: '',
    attribKpiColFormatReport: '',
    attribFiltFormatReport: '',
    nbRowInQuery: 0,
    nbColInQuery: 0,
    UserId: '',
    ValueColumnFiltered: ''
  };*/
  //******************************

  // related about summary report
  isOneclickSummaryReport = true;
  summaryFilterKpi = '';
  summaryFilterColumVal = '';
  summaryFilterItems = '';
  ////////////////////////////

  constructor(
    private sharedService: SharedService,
    public wizardCubeService: WizardCubeService,
    private reportService: ReportOlapService,
    private router: Router,
    private snackbar: MatSnackBar,
    private kendoDialogSharedService: KendoDialogSharedMethodsService,
    private sharedMethodService: SharedMethodsService,
    private sharedListBoxServiceMethod: ListBoxSharedMethodsService,
    private kendoChartService: KendoChartService,
    private DropDownMethodService:DropDownSharedMethodsService,
    private route: ActivatedRoute,

  ) {

  }
  ngOnDestroy(): void {
    this.sharedService.setDisableButton(false); // Reset the button state when leaving the component

  }
  ngOnInit(): void {
    this.disableButton = this.sharedService.getDisableButton();
   // this.manageActivatedRoute();
    this.olapCubeChoosen = this.sharedService.olapCubeChoosen;
    this.report=this.sharedService.reportOlap;
    this.callTreelistOdata();
    //this.labelFirstLevel += this.olapCubeChoosen.listHirearchyRows[0].rowName;
  /*  this.labelSecondLevel +=
      this.olapCubeChoosen.listHirearchyRows.length > 1
        ? this.olapCubeChoosen.listHirearchyRows[1].rowName
        : 'NONE';*/
   /* this.labelThirdLevel +=
      this.olapCubeChoosen.listHirearchyRows.length == 3
        ? this.olapCubeChoosen.listHirearchyRows[2].rowName
        : 'NONE';*/
    this.labelAtt += this.olapCubeChoosen.nbRowInQuery;
    // Subscribe to the NavigationStart event of the Router
    this.routerSubscription = this.router.events.subscribe((event) => {
      if (event instanceof NavigationStart) {
        // Close the Kendo UI window when navigating away
        this.closeKendoWindow();
        this.kendoDialogSharedService.closeKendoDialog(
          'SaveRportDialog',
          'kendoDialog'
        );
        this.kendoDialogSharedService.closeKendoDialog(
          'SummaryReport',
          'kendoDialog'
        );
        this.kendoDialogSharedService.closeKendoDialog(
          'dialog-options-charts',
          'kendoWindow'
        );
      }
    });
    this.changeEventListBox();
    this.closeEventKendoWindow();
    this.removeEventListBox();
  }
  ngAfterViewInit(): void {
    var dataSourceCharts = this.loadChartsDataSource();
    this.sharedListBoxServiceMethod.initializelistBoxComp(
      'listBoxCharts',
      'text',
      'value',
      'single',
      ['moveUp', 'moveDown'],
      null,
      dataSourceCharts,
      {
        enabled: true,
      },
      '<span><i class="#= data.iconClass #"></i> #: data.text #</span>'
    );
    this.sharedListBoxServiceMethod.initializelistBoxComp(
      'listBoxHirarchyRows',
      'text',
      'text',
      'single',
      [],
      null,
      [this.extractFirstRow(0)],
      null,
      null
    );
    this.sharedListBoxServiceMethod.initializelistBoxComp(
      'listFilterFirstLevel',
      'position',
      'position',
      'multiple',
      ['remove', 'moveUp', 'moveDown'],
      null,
      [],
      null,
      null
    );
    this.sharedListBoxServiceMethod.initializelistBoxComp(
      'listFilterSecondLevel',
      'position',
      'position',
      'multiple',
      ['remove', 'moveUp', 'moveDown'],
      null,
      [],
      null,
      null
    );
    this.sharedListBoxServiceMethod.initializelistBoxComp(
      'listFilterThirdLevel',
      'position',
      'position',
      'multiple',
      ['remove', 'moveUp', 'moveDown'],
      null,
      [],
      null,
      null
    );
    this.destinationDroppedArea('destination-container');
    this.kendoDialogSharedService.setConfigurationKendoWindow(
      'windowAdvancedReport',
      800,
      600,
      'Advanced Filtering by Category Level',
      ['Pin', 'Minimize', 'Maximize', 'Close']
    );
    this.kendoDialogSharedService.setConfigurationKendoWindow(
      'dialog-options-charts',
      400,
      250,
      'Configurations charts',
      ['Pin', 'Minimize', 'Maximize', 'Close']
    );
    this.initializeKendoGroupButton();
    this.sharedMethodService.setWidthHeightKendoCom(
      'listBoxCharts',
      'kendoListBox',
      270,
      200
    );
    this.sharedMethodService.setWidthHeightKendoCom(
      'listFilterFirstLevel',
      'kendoListBox',
      230,
      200
    );
    this.sharedMethodService.setWidthHeightKendoCom(
      'listFilterSecondLevel',
      'kendoListBox',
      230,
      200
    );
    this.sharedMethodService.setWidthHeightKendoCom(
      'listFilterThirdLevel',
      'kendoListBox',
      230,
      200
    );
    this.sharedListBoxServiceMethod.initializelistBoxComp(
      'listBoxKpi',
      'text',
      'text',
      'multiple',
      [],
      null,
      [],
      null,
      null
    );
    this.sharedMethodService.setWidthHeightKendoCom(
      'listBoxKpi',
      'kendoListBox',
      230,
      200
    );
    this.kendoDialogSharedService.setConfigurationKendoDialog(
      'SaveRportDialog',
      1150,
      600,
      'Save Report'
    );
    this.kendoDialogSharedService.setConfigurationKendoDialog(
      'SummaryReport',
      1150,
      600,
      'Summary Report'
    );
    var listBoxKpi = this.sharedMethodService.callKendoComponent(
      'listBoxKpi',
      'kendoListBox'
    );
    this.olapCubeChoosen.measCalChoosen.map((item: any) => {
      listBoxKpi.dataSource.add({
        text: item,
      });
    });
    this.DropDownMethodService.initializeDropDownComp('typee-chart','select type chart','text','value');
    this.sharedMethodService.setWidthHeightKendoCom(
      'typee-chart',
      'kendoDropDownList',
      200,
      0
    );
    this.loadDropDownTypeChart();
  }
 /* manageActivatedRoute(){
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => {
      this.fromReportComponent = event.url.includes('report-interf');
      console.log("routerrrrrrrrrrrrrr",event);
    });
  }*/


  loadDropDownTypeChart(){
    var droDowChart = this.sharedMethodService.callKendoComponent(
      'typee-chart',
      'kendoDropDownList'
    );
    droDowChart.setDataSource(this.loadTypeChart());

  }
  closeKendoWindow() {
    this.kendoDialogSharedService.closeKendoDialog(
      'windowAdvancedReport',
      'kendoWindow'
    );
    this.windowIsClosed = true;
  }
  initializeKendoGroupButton() {
    $('#select-period').kendoButtonGroup({
      select: this.changeSelectGroupBtn.bind(this),
      index: 0,
    });
  }

  filterFirstLevelData() /*: any[]*/ {
    var listFirstLevel = this.sharedMethodService.callKendoComponent(
      'listFilterFirstLevel',
      'kendoListBox'
    );
    var treeList = this.sharedMethodService.callKendoComponent(
      'treelist2',
      'kendoTreeList'
    );
    var filteredData: any[] = [];
    var selectedRow = treeList.select();
    selectedRow.toArray().map((item: any) => {
      var dataItem = treeList.dataItem(item);
    //  console.log('selectedRow tree list', dataItem);
      if (
        !this.sharedListBoxServiceMethod.chkeckExistanceItemsListBox(
          dataItem.position,
          listFirstLevel,
          'position'
        ) &&
        dataItem.parentId === null
      ) {
        // filteredData.push(dataItem);
        listFirstLevel.dataSource.add(dataItem);
      }
    });
    // return filteredData;
  }
  changeSelectGroupBtn(e: any) {
    // console.log("selected index:" + e.indices);
    if (e.indices == 0) {
      ///////////////////////////level 1
      this.sharedListBoxServiceMethod.emptyKendoListBox(
        'listFilterSecondLevel',
        'kendoListBox'
      );
      this.sharedListBoxServiceMethod.emptyKendoListBox(
        'listFilterThirdLevel',
        'kendoListBox'
      );
      this.filterFirstLevelData();
      this.nbFirstLevel = this.sharedListBoxServiceMethod.getLengthDataListBox(
        'listFilterFirstLevel'
      );
      this.nbSecondLevel = 0;
      this.nbThirdLevel = 0;
    } else if (e.indices == 1) {
      this.sharedListBoxServiceMethod.emptyKendoListBox(
        'listFilterThirdLevel',
        'kendoListBox'
      );
      this.nbThirdLevel = 0;
    }
  }
  clickRepButton() {
    this.windowIsClosed = false;
    this.sharedListBoxServiceMethod.emptyKendoListBox(
      'listFilterFirstLevel',
      'kendoListBox'
    );
    this.sharedListBoxServiceMethod.emptyKendoListBox(
      'listFilterSecondLevel',
      'kendoListBox'
    );
    this.sharedListBoxServiceMethod.emptyKendoListBox(
      'listFilterThirdLevel',
      'kendoListBox'
    );
    this.kendoDialogSharedService.openCenteredWindow('windowAdvancedReport');
    this.nbFirstLevel = 0;
    this.nbSecondLevel = 0;
    this.nbThirdLevel = 0;
  }
  loadChartsDataSource(): any {
    var dataSourceChats = [
      { text: 'pieChart', value: 1, iconClass: 'fas fa-chart-pie' },
      { text: 'barChart', value: 2, iconClass: 'fas fa-chart-bar' },
      { text: 'columnChart', value: 3, iconClass: 'fa-solid fa-chart-column' },
      { text: 'stackedBarChart', value: 4, iconClass: 'fas fa-chart-bar' },
      { text: 'stackedColumnChart', value: 5, iconClass: 'fas fa-chart-bar' },
      { text: 'LineChart', value: 6, iconClass: 'fas fa-chart-line' },
      { text: 'AreaChart', value: 7, iconClass: 'fas fa-chart-area' },
      {
        text: 'RadarLineChart',
        value: 8,
        iconClass: 'fa fa-audio-description',
      },
      {
        text: 'RadarColumnChart',
        value: 9,
        iconClass: 'fa fa-audio-description',
      },
      {
        text: 'stackedRadarColumnChart',
        value: 10,
        iconClass: 'fa fa-audio-description',
      },
    ];
    return dataSourceChats;
  }
  loadTypeChart(): any[] {
    var dataSourTyChart = [
      { text: 'Standard', value: 1},
      { text: 'Currency', value: 2},
      { text: 'Percent', value: 3},

    ];
    return dataSourTyChart;
  }

  PopulateLevel(componentParentId: any, componentChildId: any) {
    var treeList = this.sharedMethodService.callKendoComponent(
      'treelist2',
      'kendoTreeList'
    );
    var dataSource = treeList.dataSource._data;
   // console.log('dataaaa', dataSource);
    var selectedParentLevelRow =
      this.sharedListBoxServiceMethod.selectedItemListBox(
        componentParentId,
        'kendoListBox'
      );
    var listChildLevel = this.sharedMethodService.callKendoComponent(
      componentChildId,
      'kendoListBox'
    );
    var dataSourceChildren: any[] = [];
    let i = selectedParentLevelRow.id + 1;
    if (this.olapCubeChoosen.nbRowInQuery == 2) {
      while (i < dataSource.length && dataSource[i].parentId !== null) {
        dataSourceChildren.push(dataSource[i]);
        i++;
      }
      console.log('dataaaa econd level');
    } else if (this.olapCubeChoosen.nbRowInQuery == 3) {
      for (
        let i = selectedParentLevelRow.id + 1;
        i < dataSource.length && dataSource[i].parentId !== null;
        i++
      ) {
        if (dataSource[i].parentId === selectedParentLevelRow.id) {
          dataSourceChildren.push(dataSource[i]);
        }
      }
    }
    listChildLevel.setDataSource(dataSourceChildren);
  }
  destinationDroppedArea(destinationCompDropedId: string) {
    // Initialize the destination container as a drop target
    $(`#${destinationCompDropedId}`).kendoDropTarget({
      drop: (e: any) => {
        this.loadKendoChart();
      //  console.log('nourrrrrrrrrrrrdropppppppppppppppp');
      },
    });
  }
  // Assuming you have a function to limit the string length
  limitStringLength(str: any, maxLength: any): any {
    if (str.length > maxLength) {
      return str.slice(0, maxLength) + '...'; // Display an ellipsis for long names
    }
    return str;
  }
  prepareProffessionnalColors(): any {
    var colors = [
      '#6c757d',
      '#1f2d3d',
      '#17a2b885',
      '#ff408159',
      '#212529',
      '#00000087',
      '#6f42c194',
      '#7c7d6c',
      '#c17142',
      '#4046ff61',
      '#2861a794',
      '#c1a642',
      '#c14242',
      '#dc354563',
      '#3f51b5e3',
      '#6f42c194',
      '#364034b8',
      '#ffd640',
      '#FF5733',//A vibrant orange
      '#C70039',//A deep crimson
      '#900C3F',// A rich maroon
      '#581845',// A dark purple
      '#DAF7A6',////A light lime green
      '#FFC300',//A bright yellow
      '#74C476',////A medium sea green
      '#8E44AD',// A vivid violet
      '#3498DB',//A soft blue
      '#2ECC71',////A neon green
      '#F39C12',//A pumpkin orange
      '#D35400',////A burnt orange
      '#1ABC9C',//A turquoise
      '#2E4053',//A dark slate gray
      '#7DCEA0',////A pastel green
      '#76D7C4',//A light sea green
      '#F7DC6F',// A pale goldenrod
      '#85C1E9',//A sky blue
      '#D7BDE2',//A light lavender
      '#F1948A',//A soft salmon
      '#CD6155',// A dark salmon
      '#EC7063',//A light coral
      '#AAB7B8',//A platinum
      '#45B39D',//A medium aquamarine
      '#34495E',//A strong navy blue
      '#58D68D',//A light green
      '#FA8072',// Salmon pink
      '#B03A2E',//Barn red
      '#2874A6',//Yale blue
      '#76448A',//Royal purple
      '#1E8449',//Jade green
      '#641E16',// Dark red
    ];
    return colors;
  }
  prepareMaxChart(maxKpiValue: any): any {
    if(maxKpiValue<1){

      return  0.005;
   //  return 1-maxKpiValue;
    }
    if(maxKpiValue=1){

      return  0;
   //  return 1-maxKpiValue;
    }
    if (maxKpiValue < 100) {
      return 10;
    // return 100-maxKpiValue;
    }
    if (maxKpiValue < 1000) {
      return 100;
    }
    if (maxKpiValue < 10000) {
      return 1000;
    }
    if (maxKpiValue < 100000) {
      return 1000;
    }
    if (maxKpiValue < 1000000) {
      return 100000;
    }
    if (maxKpiValue < 10000000) {
      console.log('deuillllllll');
      return 1000000;
    }
    if (maxKpiValue < 100000000) {
      console.log('deuillllll2ll');

      return 10000000;
    }
    if (maxKpiValue < 1000000000) {
      return 100000000;
    }
    if (maxKpiValue < 10000000000) {
      return 1000000000;
    }
    if (maxKpiValue < 100000000000) {
      return 10000000000;
    }
    if (maxKpiValue < 1000000000000) {
      return 100000000000;
    }
    if (maxKpiValue < 10000000000000) {
      return 1000000000000;
    }

  }

  loadKendoChart() {
    //var maxSeuilChart=10;
    var listKpisSelected =
      this.sharedListBoxServiceMethod.selectedMultipleItemsListBox(
        'listBoxKpi',
        'kendoListBox',
        'text'
      );
   /* var selectedRow = this.sharedListBoxServiceMethod.selectedItemListBox(
      'listBoxHirarchyRows',
      'kendoListBox'
    );*/
    var selectedChart = this.sharedListBoxServiceMethod.selectedItemListBox(
      'listBoxCharts',
      'kendoListBox'
    );
    var chartId = 'chart-' + new Date().getTime(); // Generate a unique ID
    /* var newChartContainer = $('<div class="chart-container"></div>').attr(
      'id',
      chartId
    );*/
    // var newChartContainer: HTMLElement = this.myDivElement.nativeElement;
    //  newChartContainer.setAttribute('id', chartId);
    // console.log('ddd',newChartContainer.id);
    var newChartContainer: HTMLDivElement = document.createElement('div');
    newChartContainer.classList.add('chart-container');
    newChartContainer.setAttribute('id', chartId);
    var editIcon = $(
      '<i class="fas fa-edit" title="Edit title chart" style="cursor:pointer"></i>'
    ).attr('id', chartId);
    var removeIcon = $(
      '<i class="fas fa-trash-alt" title="Remove chart" style="cursor:pointer"></i>'
    ).attr('id', chartId);
    this.removeIconEvent(removeIcon, newChartContainer, editIcon);
    this.editTitleChart(editIcon, newChartContainer);

    if (listKpisSelected.length != 0) {
      $('#charts').append(
        ' ',
        newChartContainer,
        ' ',
        removeIcon,
        '  ',
        editIcon
      );
      if (
        selectedChart.value == 1) {
        var chartData = this.prepareDataForChart(
          listKpisSelected,
          true,newChartContainer,removeIcon,editIcon
        ).ChartData;
        var titleReport = this.prepareDataForChart(
          listKpisSelected,
          true,newChartContainer,removeIcon,editIcon
        ).titleReport;
        console.log('chart datatattata',chartData);
        this.kendoChartService.createPieChart(
          chartData,
          newChartContainer,
          titleReport,
          900,
          450,
          45
        );
      } else if (selectedChart.value == 2 ) {
        var chartData = this.prepareDataForChart(
          listKpisSelected,
          false,newChartContainer,removeIcon,editIcon
        ).seriesData;
        var maxKpiValue = this.prepareDataForChart(
          listKpisSelected,
          false,newChartContainer,removeIcon,editIcon
        ).maxKPIValue;
        var titleReport = this.prepareDataForChart(
          listKpisSelected,
          false,newChartContainer,removeIcon,editIcon
        ).titleReport;
        //var maxSeuilChart=this.prepareMaxChart(maxKpiValue);
        //   chartData[0].data.length
        console.log('chart datatattata',chartData);
        if(chartData!==undefined){
          this.kendoChartService.createColBarOrStackedChart(
            chartData,
            newChartContainer,
            'bar',
            false,
            maxKpiValue + this.prepareMaxChart(maxKpiValue),
            titleReport,
            0,
            1100,
            600,
            'x'
          );
        }

      } else if (selectedChart.value == 3 ) {
        var chartData = this.prepareDataForChart(
          listKpisSelected,
          false,newChartContainer,removeIcon,editIcon
        ).seriesData;
        var maxKpiValue = this.prepareDataForChart(
          listKpisSelected,
          false,newChartContainer,removeIcon,editIcon
        ).maxKPIValue;
        var titleReport = this.prepareDataForChart(
          listKpisSelected,
          false,newChartContainer,removeIcon,editIcon
        ).titleReport;
        if(chartData!==undefined){
          this.kendoChartService.createColBarOrStackedChart(
            chartData,
            newChartContainer,
            'column',
            false,
            maxKpiValue + this.prepareMaxChart(maxKpiValue),
            titleReport,
            45,
            1100,
            600,
            'y'
          );
        //  console.log('maxkpivalueeee', maxKpiValue);
        //  console.log('preparemax', this.prepareMaxChart(maxKpiValue));
          console.log('totalmax', maxKpiValue + this.prepareMaxChart(maxKpiValue));


        }

      } else if (selectedChart.value == 4) {
        var chartData = this.prepareDataForChart(
          listKpisSelected,
          false,newChartContainer,removeIcon,editIcon
        ).seriesData;
        var titleReport = this.prepareDataForChart(
          listKpisSelected,
          false,newChartContainer,removeIcon,editIcon
        ).titleReport;
        if(chartData!==undefined){
          this.kendoChartService.createColBarOrStackedChart(
            chartData,
            newChartContainer,
            'bar',
            true,
            null,
            titleReport,
            0,
            1100,
            600,
            'x'
          );
        }

      } else if (selectedChart.value == 5) {
        var chartData = this.prepareDataForChart(
          listKpisSelected,
          false,newChartContainer,removeIcon,editIcon
        ).seriesData;
        var titleReport = this.prepareDataForChart(
          listKpisSelected,
          false,newChartContainer,removeIcon,editIcon
        ).titleReport;
        if(chartData!==undefined){
          this.kendoChartService.createColBarOrStackedChart(
            chartData,
            newChartContainer,
            'column',
            true,
            null,
            titleReport,
            45,
            1100,
            600,
            'y'
          );
        }

      } else if (selectedChart.value == 6) {
        var chartData = this.prepareDataForChart(
          listKpisSelected,
          false,newChartContainer,removeIcon,editIcon
        ).seriesData;
        var maxKpiValue = this.prepareDataForChart(
          listKpisSelected,
          false,newChartContainer,removeIcon,editIcon
        ).maxKPIValue;
        var titleReport = this.prepareDataForChart(
          listKpisSelected,
          false,newChartContainer,removeIcon,editIcon
        ).titleReport;
        if(chartData!==undefined){
          this.kendoChartService.createColBarOrStackedChart(
            chartData,
            newChartContainer,
            'line',
            false,
            maxKpiValue + this.prepareMaxChart(maxKpiValue),
            titleReport,
            45,
            1100,
            600,
            'y'
          );
        }

      } else if (selectedChart.value == 7) {
        var chartData = this.prepareDataForChart(
          listKpisSelected,
          false,newChartContainer,removeIcon,editIcon
        ).seriesData;
        var maxKpiValue = this.prepareDataForChart(
          listKpisSelected,
          false,newChartContainer,removeIcon,editIcon
        ).maxKPIValue;
        var titleReport = this.prepareDataForChart(
          listKpisSelected,
          false,newChartContainer,removeIcon,editIcon
        ).titleReport;
        if(chartData!==undefined){
          this.kendoChartService.createColBarOrStackedChart(
            chartData,
            newChartContainer,
            'area',
            false,
            maxKpiValue + this.prepareMaxChart(maxKpiValue),
            titleReport,
            45,
            1100,
            600,
            'y'
          );
        }

      } else if (selectedChart.value == 8) {
        var chartData = this.prepareDataForChart(
          listKpisSelected,
          false,newChartContainer,removeIcon,editIcon
        ).seriesData;
        console.log(chartData);
        var maxKpiValue = this.prepareDataForChart(
          listKpisSelected,
          false,newChartContainer,removeIcon,editIcon
        ).maxKPIValue;
        var titleReport = this.prepareDataForChart(
          listKpisSelected,
          false,newChartContainer,removeIcon,editIcon
        ).titleReport;
        if(chartData!==undefined){
          this.kendoChartService.createColBarOrStackedChart(
            chartData,
            newChartContainer,
            'radarLine',
            false,
            maxKpiValue + this.prepareMaxChart(maxKpiValue),
            titleReport,
            0,
            1100,
            600,
            'y'
          );
        }

      } else if (selectedChart.value == 9) {
        var chartData = this.prepareDataForChart(
          listKpisSelected,
          false,newChartContainer,removeIcon,editIcon
        ).seriesData;
        console.log(chartData);
        var maxKpiValue = this.prepareDataForChart(
          listKpisSelected,
          false,newChartContainer,removeIcon,editIcon
        ).maxKPIValue;
        var titleReport = this.prepareDataForChart(
          listKpisSelected,
          false,newChartContainer,removeIcon,editIcon
        ).titleReport;
        if(chartData!==undefined){
          this.kendoChartService.createColBarOrStackedChart(
            chartData,
            newChartContainer,
            'radarColumn',
            false,
            maxKpiValue + this.prepareMaxChart(maxKpiValue),
            titleReport,
            0,
            1100,
            600,
            'y'
          );
        }

      } else if (selectedChart.value == 10) {
        var chartData = this.prepareDataForChart(
          listKpisSelected,
          false,newChartContainer,removeIcon,editIcon
        ).seriesData;
        console.log(chartData);
        var maxKpiValue = this.prepareDataForChart(
          listKpisSelected,
          false,newChartContainer,removeIcon,editIcon
        ).maxKPIValue;
        var titleReport = this.prepareDataForChart(
          listKpisSelected,
          false,newChartContainer,removeIcon,editIcon
        ).titleReport;
        if(chartData!==undefined){
          this.kendoChartService.createColBarOrStackedChart(
            chartData,
            newChartContainer,
            'radarColumn',
            true,
            null,
            titleReport,
            0,
            1100,
            600,
            'y'
          );
        }

      }

    //  else{
       /* newChartContainer.remove();
        removeIcon.remove();
        editIcon.remove();
        this.cancelWindow('dialog-options-charts');
        console.log('data limit akber men 50');
        this.controlErrLengthData=true;
        setTimeout(() => {
          this.controlErrLengthData = false;
        },3000);*/
        // this.alertErrorComponent.showError();
         //this.controlErrLengthData=false;
        //this.sharedMethodService.showError(this.controlErrLengthData,3000);
    //  }

    } else {
      this.controlNumberKpi = true;
      setTimeout(() => {
        this.controlNumberKpi = false;
      },3000);
     // this.alertErrorComponent.showError();
      //this.controlNumberKpi = false;
    //this.sharedMethodService.showError(this.controlNumberKpi,3000);

    }
  }
  getKendoButtonGroupTextClicked(): any {
    var buttonGroup = $('#select-period').data('kendoButtonGroup');
    var selectedIndex = buttonGroup.current();
    return selectedIndex[0].innerText;
  }
  prepareTitleForReport(
    windIsClosed: any,
    isPieChart: any,
    isLevel1: any,
    islevel2: any,
    isLevel3: any,
    listKpisSelected: any[]
  ): any {
    var titleReport = '';
    var firstSepWord = ' By ';
    var secondSepWord = ' On ';
    var thirdSepWord = ' And ';
    var kpiChart = isPieChart
      ? listKpisSelected[0]
      : listKpisSelected.join(', ');
    if (windIsClosed) {
      return (titleReport +=
        this.extractFirstRow(0).text + firstSepWord + kpiChart);
    } else if (isLevel1) {
      return (titleReport +=
        this.extractFirstRow(0).text + firstSepWord + kpiChart);
    } else if (islevel2) {
      return (titleReport +=
        this.extractFirstRow(1).text +
        firstSepWord +
        kpiChart +
        secondSepWord +
        this.sharedListBoxServiceMethod.selectedItemListBox(
          'listFilterFirstLevel',
          'kendoListBox'
        ).position);
    } else {
      return (titleReport +=
        this.extractFirstRow(2).text +
        firstSepWord +
        kpiChart +
        secondSepWord +
        this.sharedListBoxServiceMethod.selectedItemListBox(
          'listFilterSecondLevel',
          'kendoListBox'
        ).position +
        thirdSepWord +
        this.sharedListBoxServiceMethod.selectedItemListBox(
          'listFilterFirstLevel',
          'kendoListBox'
        ).position);
    }
  }
  prepareDataForChart(
    listKpisSelected: any[],
    isPieChart: any,
    newChartContainer:any,
    removeIcon:any,
    editIcon:any
  ): any {
    var filteredData: any[] = [];
    var maxLength = 15;
    var titleReport = '';
    var colors = this.prepareProffessionnalColors();
    if (this.windowIsClosed == true) {
      filteredData = this.sharedMethodService
        .getDataSourceTreeList('treelist2', 'kendoTreeList')
        .filter((item: any) => item.parentId === null);
        if(filteredData.length>50){
          newChartContainer.remove();
        removeIcon.remove();
        editIcon.remove();
         // console.log('supppppppppppp50');
          this.controlErrLengthData=true;
          setTimeout(() => {
            this.controlErrLengthData = false;
          },3000);
          return {};
        }
      titleReport += this.prepareTitleForReport(
        this.windowIsClosed,
        isPieChart,
        false,
        false,
        false,
        listKpisSelected
      );
    } else {
      var innerText = this.getKendoButtonGroupTextClicked();
      if (JSON.stringify(innerText).includes('level1')) {
        filteredData =
          this.sharedListBoxServiceMethod.selectedFullMultipleDataItemsListBox(
            'listFilterFirstLevel',
            'kendoListBox'
          );
          if(filteredData.length>50){
            this.removeChartAndIcons( newChartContainer, removeIcon,editIcon);
              this.controlErrLengthData=true;
              setTimeout(() => {
                this.controlErrLengthData = false;
              },3000);
              return {};
          }
        if (filteredData.length != 0) {
          titleReport += this.prepareTitleForReport(
            this.windowIsClosed,
            isPieChart,
            true,
            false,
            false,
            listKpisSelected
          );
        } else {
            this.removeChartAndIcons( newChartContainer, removeIcon,editIcon);
              this.controlAdvancedReportLevel = true;
              setTimeout(() => {
                this.controlAdvancedReportLevel = false;
              },3000);
              return {};
        }
      } else if (JSON.stringify(innerText).includes('level2')) {
        filteredData =
          this.sharedListBoxServiceMethod.selectedFullMultipleDataItemsListBox(
            'listFilterSecondLevel',
            'kendoListBox'
          );
          if(filteredData.length>50){
            this.removeChartAndIcons( newChartContainer, removeIcon,editIcon);
              this.controlErrLengthData=true;
              setTimeout(() => {
                this.controlErrLengthData = false;
              },3000);
              return {};
          }
        if (filteredData.length != 0) {
          titleReport += this.prepareTitleForReport(
            this.windowIsClosed,
            isPieChart,
            false,
            true,
            false,
            listKpisSelected
          );
        }
        else {
          this.removeChartAndIcons( newChartContainer, removeIcon,editIcon);
            this.controlAdvancedReportLevel = true;
            setTimeout(() => {
              this.controlAdvancedReportLevel = false;
            },3000);
            return {};
      }

      } else if (JSON.stringify(innerText).includes('level3')) {
        filteredData =
          this.sharedListBoxServiceMethod.selectedFullMultipleDataItemsListBox(
            'listFilterThirdLevel',
            'kendoListBox'
          );
          if(filteredData.length>50){
            this.removeChartAndIcons( newChartContainer, removeIcon,editIcon);
              this.controlErrLengthData=true;
              setTimeout(() => {
                this.controlErrLengthData = false;
              },3000);
              return {};
          }
        if (filteredData.length != 0) {
          titleReport += this.prepareTitleForReport(
            this.windowIsClosed,
            isPieChart,
            false,
            false,
            true,
            listKpisSelected
          );
        }
        else {
          this.removeChartAndIcons( newChartContainer, removeIcon,editIcon);
            this.controlAdvancedReportLevel = true;
            setTimeout(() => {
              this.controlAdvancedReportLevel = false;
            },3000);
            return {};
      }
      }
    }
    // Initialize max value to a very small number
    var maxKPIValue = 0;
    if (isPieChart) {
      var ChartData = filteredData.map((item, index) => {
        // Use 'position' as the category and limit its length
        var category = this.limitStringLength(item.position, maxLength);
        // Assign a color from the colors array based on the index
        var color = colors[index % colors.length];
        return {
          category: category, // Use 'position' as the category
          value: item[listKpisSelected[0]] || 0, // Use the selected KPI value, default to 0 if it doesn't exist
          color: color,
        };
      });
      // return ChartData;
      return { ChartData: ChartData, titleReport: titleReport };
    } else {
      // Create an array to store series data
      var seriesData: any = [];
      // Iterate through each selected KPI
      listKpisSelected.forEach((kpi: any, index: any) => {
        var kpiSeriesData = filteredData.map((item) => {
          // Use 'position' as the category and limit its length
          var category = this.limitStringLength(item.position, maxLength);
          // Assign a color from the colors array based on the index
          var color = colors[index % colors.length];
          // get maxvalue
          maxKPIValue = item[kpi] > maxKPIValue ? item[kpi] : maxKPIValue;
          return {
            category: category, // Use 'position' as the category
            value: item[kpi] || 0, // Use the selected KPI value, default to 0 if it doesn't exist
            color: color,
          };
        });
        // Create a series object for the current KPI
        var series = {
          name: kpi, // Name the series based on the KPI name
          data: kpiSeriesData, // Data for the series
          // type: 'bar', // Determine the series type based on the chartType parameter
          color: colors[index % colors.length], // Set the color for the series
          labels: {
            visible: true,
            background: 'none',
            // distance:70
            // rotation:45
            // color:"black",
           // font: "12px sans-serif",
            format: "{0:n3}"

          },
        };
        // Push the series object to the seriesData array
        seriesData.push(series);
      });
      console.log('nourrrrrrrrrrrrrr', seriesData)
      return {
        seriesData: seriesData,
        maxKPIValue: maxKPIValue,
        titleReport: titleReport,
      };
    }
  }

  removeIconEvent(removeIcon: any, newChartContainer: any, editIcon: any) {
    // Add an event listener to the remove button
    removeIcon.on('click', () => {
      // Remove the chart container and the button
      newChartContainer.remove();
      removeIcon.remove();
      editIcon.remove();
      this.cancelWindow('dialog-options-charts');
      // inpuTitleChart.remove();
      // cancelIcon.remove();
    });
  }

  editTitleChart(editIcon: any, newChartContainer: any) {
    // Add an event listener to the remove button
    editIcon.on('click', () => {
      /*   console.log('yeahhhh',newChartContainer);
      var currentTitle = $(`#${newChartContainer.id}`).data('kendoChart').options.title.text;
    //  console.log('yeahhhh33',currentTitle );
    if (inpuTitleChart.is(':hidden')) {
      console.log('The element is currently hidden.');
      inpuTitleChart.show();
      cancelIcon.show();
      inpuTitleChart.val(currentTitle);
    } else {
      inpuTitleChart.focus();
      console.log('The element is currently visible.');
      var chart =$(`#${newChartContainer.id}`).data('kendoChart');
      chart.options.title.text=inpuTitleChart.val();
      console.log('chart',chart)
    //  chart.refresh();
    var series=chart.options.series;
    console.log('seriesssss',series)

        series.map((item: any) => {
          item.labels.visible=false;
          });
      chart.redraw();
      inpuTitleChart.hide();
      cancelIcon.hide();

      //  console.log('seriesssss',series)
      this.kendoDialogSharedService.openCenteredWindow('dialog-options-charts');


    }*/
      // $(`#${newChartContainer[0].id}`).append(inpuTitleChart);
      // newChartContainer.append(inpuTitleChart);
      //   inpuTitleChart.toggle();
      //  console.log('yeahhhh',inpuTitleChart);
      // console.log('yeahhhh222', inpuTitleChart.toggle());

      /*  if (inpuTitleChart.id(':visible')) {
        inpuTitleChart.focus();
        var chart =newChartContainer.data('kendoChart');
        chart.options.title.text=$(`#${id}`).val()
       chart.refresh();
       inpuTitleChart.hide();
      }
      else{
        inpuTitleChart.show();
        console.log('yeahhhh');
      }*/

      // Remove the chart container and the button
      /*console.log('yeahhhh');
       */
      var currentTitle = $(`#${newChartContainer.id}`).data('kendoChart')
        .options.title.text;
      var chart = $(`#${newChartContainer.id}`).data('kendoChart');
      this.titleChartEditedInput = currentTitle;
      var seriesLabelVisibleState = chart.options.series[0].labels.visible;
      this.isShowValChart = seriesLabelVisibleState;
     // console.log('etata label viible', seriesLabelVisibleState);
      this.newChartContainer = newChartContainer;
      var droDowChart = this.sharedMethodService.callKendoComponent(
        'typee-chart',
        'kendoDropDownList'
      );
      var formatChart=chart.options.series[0].labels.format;
      droDowChart.value(formatChart==this.kendoChartService.formatRound3?1:(formatChart==this.kendoChartService.formatCurrency?2:3));
     // console.log('format serie data ', chart.options.series[0].labels.format);
     // console.log('tootlip template', chart.options.tooltip.template);
     // console.log('value Axis', chart.options.valueAxis.labels.format);
      this.kendoDialogSharedService.openCenteredWindow('dialog-options-charts');
    });
  }
  applyUpdateChart() {
    var selectTypeChart = this.DropDownMethodService.selectedValueDropDownList(
      'typee-chart',
      'kendoDropDownList'
    );

    var formatChart=selectTypeChart==1?this.kendoChartService.formatRound3:
    (selectTypeChart==2?this.kendoChartService.formatCurrency:this.kendoChartService.formatPercent);
    var tooltipChart=selectTypeChart==1?this.kendoChartService.tooltipForRound3:
    (selectTypeChart==2?this.kendoChartService.tooltipForCurrency:this.kendoChartService.tooltipForPercent);
    var chart = $(`#${this.newChartContainer.id}`).data('kendoChart');
   var templateTooltip=chart.options.series[0].type=="pie"?"category":"series.name"
    chart.options.title.text = this.titleChartEditedInput;
    chart.options.series.map((item: any) => {
      item.labels.visible = this.isShowValChart;
      item.labels.format =formatChart;/*"{0:p}"*/ /*"{0}%"*/;
      item.tooltip.template='#= '+templateTooltip+' #: #= kendo.toString(value, "'+tooltipChart+'") #';
    });
    chart.options.valueAxis.labels.format=formatChart;
//chart.options.valueAxis.max=null;
  //  console.log('tootlip222222222222 template', chart.options.tooltip.template);
    chart.redraw();

    this.cancelWindow('dialog-options-charts');
     console.log("ettghhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhha",chart);
  }
  /*cancelTitleChart(inpuTitleChart:any,cancelIcon:any){
    cancelIcon.on('click', function () {
      inpuTitleChart.hide();
      cancelIcon.hide();
    });
  }*/

  expandTreeList(e: any) {
    var treeList = $('#treelist2').data('kendoTreeList');
    var row = e.sender.tbody.find(`tr[data-uid='${e.model.uid}']`);
    treeList.select(row);
    // this.toggleTreeList(e, true); // Hide the <td> elements
  }
  collapseTreeList(e: any) {
    // this.toggleTreeList(e, false); // Show the <td> elements
  }
  toggleTreeList(e: any, shouldHide: boolean) {
    // Get the row element
    var rowElement = e.sender.tbody.find(`tr[data-uid='${e.model.uid}']`);
    for (let i = 1; i < this.olapCubeChoosen.measCalChoosen.length + 1; i++) {
      var tdElement = rowElement.find(`td:eq(${i})`);
      // Toggle visibility based on shouldHide parameter
      tdElement[shouldHide ? 'hide' : 'show']();
    }
  }
  showInfoAdvancedReportLevel() {
    this.controlAdvancedReportLevel = true;
    setTimeout(() => {
      this.controlAdvancedReportLevel = false;
    }, 4000);
  }
  cancelDialog(dialogComp: any) {
    this.kendoDialogSharedService.cancelDialog(dialogComp);
  }
  cancelWindow(dialogComp: any) {
    this.kendoDialogSharedService.cancelWindow(dialogComp);
  }
  clearInputsDialog() {
    this.reportNameInput = '';
    this.reportInterpInput = '';
    this.isShareable = false;
  }
  openDialogSaveReport() {
    if(this.disableButton==false && this.olapCubeChoosen.olapCubeDimensions.length!=0){
      this.clearInputsDialog();
    var Dialog = $('#SaveRportDialog').data('kendoDialog');
    Dialog.open();
    }
    else{
      this.controlDisableBtn = true;
      setTimeout(() => {
        this.controlDisableBtn = false;
      },3000);
    }

  }
  openDialogSummaryReport() {
    if (this.isOneclickSummaryReport) {
      this.sharedListBoxServiceMethod.initializelistBoxComp(
        'list-summary-kpi',
        'text',
        'text',
        'multiple',
        [],
        null,
        [],
        null,
        null
      );
      this.sharedMethodService.setWidthHeightKendoCom(
        'list-summary-kpi',
        'kendoListBox',
        250,
        150
      );
      var listBoxSummKpiReport = this.sharedMethodService.callKendoComponent(
        'list-summary-kpi',
        'kendoListBox'
      );
      //  listBoxSummKpiReport.setDataSource(this.olapCubeChoosen.colSmartGrid.slice(1));
      console.log('nour', listBoxSummKpiReport);
     // this.olapCubeChoosen.measCalChoosen.map((item: any) => {
      //  listBoxSummKpiReport.dataSource.add({
       //   text: item,
      //  });
    //  });
      var match = this.olapCubeChoosen.attribKpiColFormatReport.match(/\{(.*?)\}/);
      if (match && match.length > 1) {
       // listBoxSummKpiReport=match[1].split(",").map(item => item.replace(/[\[\]]/g, '').trim());
       match[1].split(",").map((item )=>{
        listBoxSummKpiReport.dataSource.add({
          text:item.replace(/[\[\]]/g, '').trim(),
        });
        this.listKpiPdf.push(item.replace(/[\[\]]/g, '').trim());
      });
     }

      /////////////////////////////// column////////////////////////////////////////
      if (this.olapCubeChoosen.nbColInQuery != 0) {
        var inputString = this.olapCubeChoosen.ValueColumnFiltered;
        var regexPattern = /\[.*?\].&\[(.*?)\]/g;
        var matches = [...inputString.matchAll(regexPattern)];
        var resultListColValues = matches.map((match) => ({ text: match[1] }));
        var regexPatternDimCol = /\[([^[\]]+)\].*\[([^[\]]+)\].&\[.*?\]/;
        var matchDimCol = inputString.match(regexPatternDimCol);
        var dimCol = matchDimCol ? matchDimCol[1] : null;
        var dimAtt = matchDimCol ? matchDimCol[2] : null;
        var dataSourceTreeViewCol = [
          {
            text: dimCol,
            items: [{ text: dimAtt, items: resultListColValues }],
          },
        ];
        $('#treeview-summary-col').kendoTreeView({
          dataSource: dataSourceTreeViewCol,
        });
        this.listcolPdf = dataSourceTreeViewCol;
      }

      ////////////////////row //////////////////////////////////////////////////
      var inputStringRow = this.olapCubeChoosen.attribRowsFormatReport;
      var regexPatternRow = /\[([^[\]]+)\]\.\[([^[\]]+)\]/g;
      var matchesRow = [...inputStringRow.matchAll(regexPatternRow)];
      console.log('hahahahahhahaha', matchesRow[0][2]);
      var resultList = matchesRow.map((match) => {
        return {
          text: match[1],
          items: [{ text: match[2] }],
        };
      });
      $('#treeview-summary-row').kendoTreeView({
        dataSource: resultList,
      });
      this.listRowInPdf = resultList;
      /////////////////////////filter items////////////////////////////////
      if (this.olapCubeChoosen.attribFiltFormatReport != '') {
        var inputStringFilter = this.olapCubeChoosen.attribFiltFormatReport;
        var regexPatternFilter = /\[([^[\]]+)\]\.\[([^[\]]+)\].&\[([^[\]]+)\]/g;
        var matchesFilter = [...inputStringFilter.matchAll(regexPatternFilter)];
        console.log('matchesFilter', matchesFilter);
        var resultArray: any[] = [];
        var lastEntry: any = null; // Reference to the last entry in resultArray
        matchesFilter.map((match) => {
          var parentText = match[1];
          var text = match[2];
          var value = match[3];
          // Check if the current parentText and text combination matches the last entry
          if (
            lastEntry &&
            lastEntry.text === parentText &&
            lastEntry.items[0].text === text
          ) {
            // Add value to the last entry's items array
            lastEntry.items[0].items.push({ text: value });
          } else {
            // Create a new entry
            var newEntry = {
              text: parentText,
              items: [{ text: text, items: [{ text: value }] }],
            };
            resultArray.push(newEntry);
            lastEntry = newEntry; // Update lastEntry reference
          }
        });

        $('#treeview-summary-filter').kendoTreeView({
          dataSource: resultArray,
        });
        this.listFilterPdf = resultArray;
      }
    }
    this.kendoDialogSharedService.openCenteredDialog('SummaryReport');
    this.isOneclickSummaryReport = false;
  }
  showErrValRepName() {
    this.ctrlValdRepName = true;
    setTimeout(() => {
      this.ctrlValdRepName = false;
    }, 3000); // 3000 milliseconds (3 seconds)
  }
  showErrValdRepInterp() {
    this.ctrlValdRepInterp = true;
    setTimeout(() => {
      this.ctrlValdRepInterp = false;
    }, 3000); // 3000 milliseconds (3 seconds)
  }
  controlValidationCompDialog(): any {
    var validItems = true;
    var reportNameInput = this.reportNameInput;
    var reportIterpInput = this.reportInterpInput;
    //var reportSharebale=this.isShareable
    if (reportNameInput == '') {
      validItems = false;
      this.showErrValRepName();
    }
    if (reportIterpInput == '') {
      validItems = false;
      this.showErrValdRepInterp();
    }
    return validItems;
  }
  prepareReportParametres() {
    this.report = this.sharedService.reportOlap;
    this.report.ReportName = this.reportNameInput;
    this.report.InterpretationReport = this.reportInterpInput;
    this.report.isSharebale = this.isShareable ? 1 : 0;
    this.report.sqlServerInstance = this.olapCubeChoosen.sqlServerInstance;
    this.report.olapCubeName = this.olapCubeChoosen.olapCubeName;
    this.report.measCalChoosen = this.olapCubeChoosen.measCalChoosen.join(', ');
    this.report.attribRowsFormatReport =
      this.olapCubeChoosen.attribRowsFormatReport;
    this.report.attribKpiColFormatReport =
      this.olapCubeChoosen.attribKpiColFormatReport;
    this.report.attribFiltFormatReport =
      this.olapCubeChoosen.attribFiltFormatReport;
    this.report.nbRowInQuery = this.olapCubeChoosen.nbRowInQuery;
    this.report.nbColInQuery = this.olapCubeChoosen.nbColInQuery;
    this.report.ValueColumnFiltered=this.olapCubeChoosen.ValueColumnFiltered;
    this.report.calculations=this.olapCubeChoosen.olapCubeCalculations.length!=0?
    this.olapCubeChoosen.olapCubeCalculations.map((item:any) => ( item.calculationName+'+'+item.formatString )).join(', ')
    :'';
    this.sharedService.setReportOlap(this.report);
    console.log('myreporttttttt',this.report);
  }
  saveReport() {
    if (this.controlValidationCompDialog()) {
      this.loadingReport = true;
      this.prepareReportParametres();
      this.reportService.AddReport(this.report).subscribe({
        next: (successResponse: any) => {
          this.loadingReport = false;
          if (successResponse == true) {
            this.cancelDialog('SaveRportDialog');
            this.sharedMethodService.showSnackbar(
              'Report Added Succefully',
              'Success',
              'succ-snackbar'
            );
          } else {
            this.cancelDialog('SaveRportDialog');
            this.sharedMethodService.showSnackbar(
              'Error contact Admin',
              'Error!',
              ''
            );
          }
        },
        error: (errorResponse: any) => {
          this.loadingReport = false;
          this.cancelDialog('SaveRportDialog');
          this.sharedMethodService.showSnackbar(
            'Error contact Admin',
            'Error!',
            ''
          );
        },
      });
    }
  }

  callTreelistOdata() {
    var cols = this.olapCubeChoosen.colSmartGrid;
    console.log('cube',this.olapCubeChoosen);
    $('#treelist2').kendoTreeList({
      dataSource: {
        type: 'odata-v4',
        transport: {
          read: {
            url: 'https://localhost:7243/cube/showGridReportOdata',
            dataType: 'json',
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(this.olapCubeChoosen),
          },
          parameterMap: (data: any, type: string) => {
            // Modify this part if required to send additional parameters or customize the request
            if (type === 'read') {
              return JSON.stringify(this.olapCubeChoosen); // Convert the object to a JSON string for the PUT request body
            }
            return data;
          },
        },
        schema: {
          model: {
            id: 'id',
            parentId: 'parentId',
            fields: {
              parentId: { field: 'parentId', nullable: true },

              id: { field: 'id', type: 'number' },
              // Define other fields as needed based on the response structure
            },
          },
        },
      },
      toolbar: [
        'pdf',

        {
          name: 'Report',
          text: 'Save Report',
          className: 'k-button',
          click: this.openDialogSaveReport.bind(this),
        },
        {
          name: 'Sum-Report',
          text: 'Summary Report',
          className: 'k-button',
          click: this.openDialogSummaryReport.bind(this),
        },
        'excel',
      ],
      pdf: {
        fileName: 'Report.pdf',
        //allPages: true,
        //    avoidLinks: true,
        //  paperSize: 'A3',
        //  margin: { top: '1cm', left: '1cm', right: '1cm', bottom: '1cm' },
        // landscape: true,
        // repeatHeaders: true,
        //scale: 0.8,
      },
      expand: this.expandTreeList.bind(this),
      collapse: this.collapseTreeList.bind(this),
      height: 800,
      filterable: true,
      sortable: true,
      //persistSelection: true,
      columns: cols,
      pageable: {
        refresh: true,
        pageSizes: [10, 20, 50, 100, 1000],
        pageSize: 10,
        //  groupable: true,
      },
      resizable: true,
      reorderable: true,
      columnMenu: true,
      excelExport: function (e: any) {
        e.workbook.fileName = 'Report.xlsx';
      },
      // selectable:true
      selectable: 'multiple, row',
    });
    var lastPageButton = $('#treelist2 .k-pager-last');
    lastPageButton.one('click', () => {
      this.getTotalDataReport();
    });
  }

  getTotalDataReport() {
    var treeList = this.sharedMethodService.callKendoComponent(
      'treelist2',
      'kendoTreeList'
    );
    var dataSource = treeList.dataSource;
    this.wizardCubeService.getTotalItemData(this.olapCubeChoosen).subscribe({
      next: (successResponse: any) => {
        successResponse.id = dataSource._total + 1;
        dataSource.add(successResponse);
        console.log('treelist datasource', successResponse);
      },
      error: (errorResponse: any) => {
        console.log(errorResponse);
      },
    });
  }

  applyGenFilterComponent(
    kendoCompId: string,
    kendoCompType: string,
    filterText: string,
    fieldText: any
  ) {
    this.sharedMethodService.applyFilterComponent(
      kendoCompId,
      kendoCompType,
      filterText,
      fieldText
    );
  }
  changeEventListBox() {
    this.sharedListBoxServiceMethod.listBoxChange.subscribe((e: any) => {
      if (e.sender.element[0].id == 'listFilterFirstLevel' && this.olapCubeChoosen.nbRowInQuery!=1) {
        this.sharedListBoxServiceMethod.emptyKendoListBox(
          'listFilterThirdLevel',
          'kendoListBox'
        );
        this.nbThirdLevel = 0;


          this.PopulateLevel('listFilterFirstLevel', 'listFilterSecondLevel');
        this.nbSecondLevel =
          this.sharedListBoxServiceMethod.getLengthDataListBox(
            'listFilterSecondLevel'
          );
      } else if (e.sender.element[0].id == 'listFilterSecondLevel' && this.olapCubeChoosen.nbRowInQuery==3) {
        this.PopulateLevel('listFilterSecondLevel', 'listFilterThirdLevel');
        this.nbThirdLevel =
          this.sharedListBoxServiceMethod.getLengthDataListBox(
            'listFilterThirdLevel'
          );
      }
    });
  }
  closeEventKendoWindow() {
    this.kendoDialogSharedService.kendoWindowClose.subscribe((e: any) => {
      if (e.sender.element[0].id == 'windowAdvancedReport') {
        this.sharedListBoxServiceMethod.emptyKendoListBox(
          'listFilterFirstLevel',
          'kendoListBox'
        );
        this.sharedListBoxServiceMethod.emptyKendoListBox(
          'listFilterSecondLevel',
          'kendoListBox'
        );
        this.windowIsClosed = true;
        console.log(e);
      }
    });
  }
  extractFirstRow(indice: any): any {
    var inputStringRow = this.olapCubeChoosen.attribRowsFormatReport;
    var regexPatternRow = /\[([^[\]]+)\]\.\[([^[\]]+)\]/g;
    var matchesRow = [...inputStringRow.matchAll(regexPatternRow)];
   // console.log('hierarchy row', matchesRow[indice]);
    return { text: matchesRow[indice][2] };
  }
  removeEventListBox() {
    this.sharedListBoxServiceMethod.removeListBox.subscribe((e: any) => {
      var idListRemoved = e.sender.element[0].id;
      if (JSON.stringify(idListRemoved).includes('listFilterFirstLevel')) {
        this.sharedListBoxServiceMethod.emptyKendoListBox(
          'listFilterSecondLevel',
          'kendoListBox'
        );
        this.nbSecondLevel = 0;
        this.sharedListBoxServiceMethod.emptyKendoListBox(
          'listFilterThirdLevel',
          'kendoListBox'
        );
        this.nbThirdLevel = 0;
        this.nbFirstLevel -= e.dataItems.length;
      } else if (
        JSON.stringify(idListRemoved).includes('listFilterSecondLevel')
      ) {
        this.sharedListBoxServiceMethod.emptyKendoListBox(
          'listFilterThirdLevel',
          'kendoListBox'
        );
        this.nbThirdLevel = 0;
        this.nbSecondLevel -= e.dataItems.length;

        if (
          e.dataItems.length ==
          this.sharedListBoxServiceMethod.getLengthDataListBox(
            'listFilterSecondLevel'
          )
        ) {
          this.sharedListBoxServiceMethod.UnselectAllListBox(
            'listFilterFirstLevel',
            'kendoListBox'
          );
        }
      } else {
        this.nbThirdLevel -= e.dataItems.length;
        if (
          e.dataItems.length ==
          this.sharedListBoxServiceMethod.getLengthDataListBox(
            'listFilterThirdLevel'
          )
        ) {
          this.sharedListBoxServiceMethod.UnselectAllListBox(
            'listFilterSecondLevel',
            'kendoListBox'
          );
        }
      }
    });
  }
  exportToPdf() {
    if (!this.isOneclickSummaryReport) {
      var group = new kendo.drawing.Group();
      var divv = this.myDivElement.nativeElement;
      kendo.drawing
        .drawDOM(`#charts`, {
          //  paperSize: "A4",
          //  margin: { left: "1cm", top: "1cm", right: "1cm", bottom: "1cm" },
          //  scale: 1,
          // height: 1000,
          //  width: 1000
        })
        .then(function (div1Group: any) {
          // div1Group.transform(kendo.geometry.transform().translate(0, 0));
          group.append(div1Group);
          divv.style.display = 'contents';
          return kendo.drawing.drawDOM(`#hhij`, {
            //  paperSize: "A4",
            //    margin: { left: "1cm", top: "1cm", right: "1cm", bottom: "1cm" },
            //  scale: 1,
            //  height: 1000,
            //   width: 1000,
          });
        })
        .then(function (div2Group: any) {
          // div2Group.transform(kendo.geometry.transform().translate(-30, 30));
          group.append(div2Group);
          // Add title to the PDF report
          var titleText = new kendo.drawing.Text(
            'Report statistics charts',
            [450, 0],
            {
              // fill: "#000",
              font: 'Bold 20px sans-serif',
              // margin: { left: "1cm", top: "1cm", right: "1cm", bottom: "1cm" }
            }
          );
          titleText.transform(kendo.geometry.transform().translate(0, -40));
          group.append(titleText);
          divv.style.display = 'none';
          kendo.drawing.pdf.saveAs(group, 'exported-content.pdf');
        });
    }
  }

  selectAllListBox() {
    var treeList = this.sharedMethodService.callKendoComponent(
      'treelist2',
      'kendoTreeList'
    );
    //console.log('tree list',treeList.dataSource._pageSize);
    //console.log('tree listtttttttt',treeList.dataSource._view);
    var row = treeList.content.find('tr:visible');
    treeList.dataSource._view.map((item: any, index: number) => {
      if (item.parentId === null) {
        const r = row.eq(index);
        treeList.select(r);
      }
    });
  }
  unSelectAllListBox() {
    var treeList = this.sharedMethodService.callKendoComponent(
      'treelist2',
      'kendoTreeList'
    );
    treeList.clearSelection();
  }
  getNumberItemsTreeList(compId:any,compType:any):any{
    var treeList= this.sharedMethodService.callKendoComponent(compId,compType);
    var dataFirstLevel = treeList.dataSource._data.filter((item: any) => item.parentId===null);
    return dataFirstLevel.length;

  }
  removeChartAndIcons(chartContainer:any, removeIcon:any, editIcon:any) {
    chartContainer.remove();
    removeIcon.remove();
    editIcon.remove();
  }

}
