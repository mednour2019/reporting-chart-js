import {
  Component,
  OnInit,
  AfterViewInit,
  Input,
  Output,
  EventEmitter,
  NgModule,
  ViewChild,
  OnDestroy,
} from '@angular/core';
import { olapCubeChoosen } from 'src/app/models/api-model/olap-cube-choosen.model';
import { ActivatedRoute, NavigationStart, Router } from '@angular/router';
import { SharedService } from 'src/app/services/shared/shared.service';
import { WizardCubeService } from 'src/app/services/wizard-cube/wizard-cube.service';
import { HttpClient } from '@angular/common/http';
import { WizardCubeComponent } from '../wizard-cube/wizard-cube.component';
import { attributeVal } from 'src/app/models/api-model/attributeval.model';
import { hierarchyRow } from 'src/app/models/api-model/hierarchyRow.model';
import { colsmartgrid } from 'src/app/models/api-model/colsmartgrid.model';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { SharedMethodsService } from 'src/app/services/shared-methods/shared-methods.service';
import { columnValData } from 'src/app/models/api-model/ColumnValData/column-val-data.model';
import { ListBoxSharedMethodsService } from 'src/app/services/list-box-shared-methods/list-box-shared-methods.service';
import { KendoDialogSharedMethodsService } from 'src/app/services/kendo-dialog-shared-methods/kendo-dialog-shared-methods.service';
import { Subscription } from 'rxjs';
import { columnValResponse } from 'src/app/models/api-model/ColumnValData/column-val-response.model';
import { ThemePalette } from '@angular/material/core';
import { AlertErrorComponent } from '../alert-error/alert-error.component';
import { KendoChartService } from 'src/app/services/kendo-chart/kendo-chart.service';
declare const $: any;

@Component({
  selector: 'app-configuration-smart-grid',
  templateUrl: './configuration-smart-grid.component.html',
  styleUrls: ['./configuration-smart-grid.component.css'],
})
export class ConfigurationSmartGridComponent
  implements OnInit, AfterViewInit, OnDestroy
{
  filterTreeView: string = '';
  filterListBoxRows: string = '';
  filterListBoxColum: string = '';
  filterListBoxKpi: string = '';
  filterTreeViewDimFilter: string = '';
  olapCubeChoosen!: olapCubeChoosen;
  startDate: any;
  endDate: any;
  loadingKpi = false;
  loadingGroup = false;
  loadingFilter = false;
  nbRowsDropped = 0;
  nbColsDropped = 0;
  nbFilterDropped = 0;
  ////////related about label and msgerror and notification , loading
  cardTitle = ' Welcome to Consulting Wizard configuration';
  cardTitleFooter = 'Welcome ......';
  loadingKpiMsg = 'Please wait while retrieving KPIS...';
  loadingGroupMsg = 'Please wait while retrieving Groups...';
  loadingFilterMsg = 'Please wait while loading Filter Event ...';
  filterInputPlaceHolder = 'Filter';
  labelKPI = 'KPIs/Formulas';
  labelGroupAtt = 'Groups && Attributtes';
  labelRow = 'Row(s)';
  labelColum = 'Column(s)';
  labelFiltResColum = 'Filtred Result Column(s)';
  labelFilter = 'Filter(s)';
  buttonTextDisplayReport = 'Display Report';
  allItems = 'First/Last :Items';

  /////////////////////////////////////////////////////////
  //////////related abour hirarchy rox and col
  messageErrorNumberItemInRow = 'Please drop at least 3 items in Row!';
  messageErrorNumberItemInCol = 'Please drop at least 1 items in Col!';
  controlNumberRow = false;
  controlNumberCol = false;
  controlValidationRowSelected = false;
  messageErrorValidationRowSelected = 'Please select at least one Row!';
  titleDialog = 'Confirm Your Selection';
  oKButtonText = 'OK';
  CancelButtonText = 'CANCEL';
  confirmDialogTitle =
    'Are you sure to  Consume this report with those Parameters?';

  columnValData: columnValData = {
    sqlServerInstance: '',
    olapCubeName: '',
    attribFiltFormatReport: '',
    dimensionParent: '',
    attribute: '',
    startIndex: 0,
    endIndex: 0,
  };
  routerSubscription: any;
  filterListFilteredBoxColum: string = '';
  filtListResFiltBoxCol: string = '';
  loadingAttCol = false;
  loadingColMsg = 'please wait until load Data..!';
  nbColumnReport = 0;
  nbFilteredCol = 0;
  newPosition = {
    field: 'position',
    title: 'Position',
    columns: null,
    width: "150px"
  };
  // related about dialog column permission/////////////////
  valueEmpty='Please Select column Value!'
  itemExist='item  is already exist!';
  emptySelectedColVal = false;
  mesgEmptySelectedCol = this.valueEmpty;
  numberMaxColumn = 10;
  ctrlValidNumbColValFilt = false;
  msgErrValidNbColFilt = 'You have already depassed number of column!';
  ctrlValidEmptyColFilt=false;
  msgErrValidEmptyColFilt = 'Please select at least one Column!';
  NoticeColNumber='Notice: number of Column(s) value(s) can be minimized when apply filter items!';
  ctrlValidNoticeColNumber = false;
  //////////////////////////////////////////////

  ////// related about filter items

  selectAllCheckbox = false;
 //itemsFilterAttrib: columnValResponse[]=[];
 loadingAttFilterItems = false;
 labelFilterItems = 'Filter items';
 nbFilterItemsReport =0;
 itemsFilteredChecked!: attributeVal;
 PrincNode:any;
 isCustomFilterItems=false;
  listFilterItems: attributeVal={
    text: '',
    textDimParent: '',
    expanded: false,
    selected: false,
    items: [],
  };
allChecked: boolean = false;
checkAllItems='AllItems';
filterText: string = '';
placeHolderFilter='Filter';
filteredItemslist:any[]=[];
msgErrorFilterItems='please check an item!';
classAlert='k-widget k-tooltip k-tooltip-validation k-invalid-msg'
classWarning="k-icon k-i-warning";
ctrValdCutomfilter=false;
  ///////////////////////////////////
  //// related about paginator
  isPaginatorDiabled = false;
  matPaginatorLength = 0;
  /////////////////////////
  @ViewChild(AlertErrorComponent) alertErrorComponent!: AlertErrorComponent;
  constructor(
    private sharedService: SharedService,
    public wizardCubeService: WizardCubeService,
    private router: Router,
    private sharedMethodService: SharedMethodsService,
    private sharedListBoxServiceMethod: ListBoxSharedMethodsService,
    private kendoDialogSharedService: KendoDialogSharedMethodsService,
    private kendoChartService: KendoChartService,
    private route: ActivatedRoute

  ) {}
  ngOnDestroy(): void {}

  ngAfterViewInit(): void {
    this.kendoDialogSharedService.setConfigurationKendoDialog(
      'dialog-filter-column',
      1200,
      600,
      'Column Configuration'
    );
    this.kendoDialogSharedService.setConfigurationKendoWindow(
      'dialog-filter-items',
      900,
      520,
      'Custom filter items',
      ['Close']
    );
    this.sharedListBoxServiceMethod.initializelistBoxComp(
      'list-filtered-column',
      'cleanVal',
      'cleanVal',
      'multiple',
      ['remove'],
      null,
      [],
      null,null
    );
    this.sharedMethodService.setWidthHeightKendoCom(
      'list-filtered-column',
      'kendoListBox',
      250,
      250
    );
    this.sharedListBoxServiceMethod.initializelistBoxComp(
      'list-result-filtered-column',
      'cleanVal',
      'cleanVal',
      'multiple',
      ['moveUp', 'moveDown', 'remove'],
      null,
      [],
      null,null
    );
    this.sharedMethodService.setWidthHeightKendoCom(
      'list-result-filtered-column',
      'kendoListBox',
      250,
      250
    );
  }

  ngOnInit(): void {


    this.routerSubscription = this.router.events.subscribe((event) => {
      if (event instanceof NavigationStart) {
        // Close the Kendo UI window when navigating away
        this.kendoDialogSharedService.closeKendoDialog(
          'dialog-filter-column',
          'kendoDialog'
        );
        this.kendoDialogSharedService.closeKendoDialog(
          'dialog-filter-items',
          'kendoWindow'
        );
      }
    });
    var treeViewDimAttr = this.initializeTreeViewComp(
      'treeview',
      this.wizardCubeService
    );
    var treeViewFilterAttr = this.initializeTreeViewComp(
      'treeviewFiltAtt',
      this.wizardCubeService
    );

    this.olapCubeChoosen = this.sharedService.olapCubeChoosen;
    console.log(this.olapCubeChoosen);
    var listBoxRows = this.callKendoJqueryListBox('listRows');

    var listBoxColum = this.callKendoJqueryListBox('listColum');
    this.route.params.subscribe(params => {

      if (this.olapCubeChoosen.olapCubeDimensions.length==0) {
        // If dimension is null, navigate to the config component
        this.router.navigate(['dashboard/configuration']);

      }
    });
    this.PopulateTreeView(this.olapCubeChoosen);
    this.PopulatelistMeasCalChecked(this.olapCubeChoosen);
    this.removeEventFromListBox();
    // important
    //this.emptyParamReport();

  }

  async initializeTreeViewComp(componentId: string, wz: WizardCubeService) {
    var dragAndDropEnabled = componentId !== 'treeviewFiltAtt';
    var treeView = $(`#${componentId}`).kendoTreeView({
      dragAndDrop: dragAndDropEnabled ? true : null,
      drag: dragAndDropEnabled ? this.OnDrag : null,
      dragstart: dragAndDropEnabled ? this.AvoidDragParentNode : null,
      drop: dragAndDropEnabled ? this.OnDrop.bind(this) : null,
      checkboxes: dragAndDropEnabled
        ? null
        : {
            checkChildren: true, // Allow checking of child nodes
          },


    });
  }
  async  PopulatelistMeasCalChecked(olapCubeChoosen: olapCubeChoosen) {
    this.loadingKpi = true;
    var listMeasCalChecked = this.callKendoJqueryListBox('listMeasCalChecked');

    var listBoxDataSource = listMeasCalChecked.data('kendoListBox').dataSource;
    // Clear existing data in the ListBox
    listBoxDataSource.data([]);

    // Combine listMeasures and listCalculations into a single array

    var combinedList = [
      ...olapCubeChoosen.olapCubeMeasures,
      ...olapCubeChoosen.olapCubeCalculations.map((item:any) => ( item.calculationName )),
    ];
    // Use the data() method to set the combined list as the data source
    listBoxDataSource.data(combinedList.map((item) => ({ text: item })));
    this.loadingKpi = false;
  }
  async PopulateTreeView(olapCubeChoosen: olapCubeChoosen) {
    this.loadingGroup = true;
    this.wizardCubeService.getAttribDimName(this.olapCubeChoosen).subscribe({
      next: (successResponse) => {
        this.loadingGroup = false;
        var treeView = $('#treeview').data('kendoTreeView');

        treeView.setDataSource(successResponse);
        console.log(successResponse);
      },
      error: (errorResponse) => {
        this.loadingGroup = false;
        console.log(errorResponse);
      },
    });
  }

  callKendoJqueryListBox(componentId: string) {
    var removeEnabled = componentId !== 'listMeasCalChecked';

    var listBox = $(`#${componentId}`).kendoListBox({
      template: '<div>${text}</div>',

      dataSource: {
        data: [],
      },
      dataTextField: 'text',
      dataValueField: 'id',
      reorder: this.reorderListBox.bind(this),
      toolbar: {
        tools: removeEnabled
          ? ['remove', 'moveUp', 'moveDown']
          : ['moveUp', 'moveDown'],
      },
      remove: removeEnabled ? this.removeFromListBox.bind(this) : null,
    });

    return listBox;
  }
  async reorderListBox(e: {
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
  }

  async enableItemTreeView(
    itemEnabled: string,
    parentTextNode: string,
    treeViewId: string
  ) {
    var treeviewListDimAttr = $(`#${treeViewId}`).data('kendoTreeView');
    var parentNode = treeviewListDimAttr.findByText(parentTextNode);
    var parentDataItem = treeviewListDimAttr.dataItem(parentNode);
    var childNodes = parentDataItem.children;
    var i = 0;
    while (i < childNodes._view.length) {
      var childNodeData = childNodes._view[i];

      if (childNodeData.text.trim() === itemEnabled) {
        var childNode = treeviewListDimAttr.findByUid(childNodeData.uid);
        if (childNode) {
          treeviewListDimAttr.enable(childNode, true);
        }
        break; // Exit the loop after enabling the node
      }

      i++;
    }
  }
  async removeFromListBox(_e2: any) {
    //handle event

    var idListRemoved = _e2.sender.element[0].id;
    if (JSON.stringify(idListRemoved).includes('listRows')) {
      this.nbRowsDropped--;
    } else if (JSON.stringify(idListRemoved).includes('listColum')) {
      this.nbColsDropped--;
    }
    var removedItem = _e2.dataItems[0];
    // Find the corresponding node in the TreeView

    this.enableItemTreeView(
      removedItem.text,
      removedItem.parentTextNode,
      'treeview'
    );
  }
  async OnDrag(e: any) {
    var dropTarget = $(e.dropTarget);
    var isAllowedDrop =
      dropTarget.hasClass('k-list-scroller k-selectable') ||
      dropTarget.hasClass('myTree k-widget k-treeview');

    if (isAllowedDrop && !dropTarget.hasClass('listMeasCalChecked')) {
      e.setStatusClass('k-add'); // Indicate allowed drop with "k-add" CSS class
    } else {
      e.preventDefault();
    }
  }
  async PopulateDataListBox(idListBox: any, item: any, e: any, itemParentNode: any) {
    var listBoxRows = $(`#${idListBox}`);
    var dataRows = listBoxRows.data();
    dataRows.kendoListBox.dataSource.add({
      text: item.text,
      parentTextNode: itemParentNode.text,
    });
    //console.log(idItems);

    $('#treeview').data('kendoTreeView').enable(e.sourceNode, false);
  }
  async OnDrop(e: any) {
    var dropTarget = $(e.dropTarget);
    var item = $('#treeview').data('kendoTreeView').dataItem(e.sourceNode);
    if (
      dropTarget.hasClass('k-list-scroller k-selectable') &&
      !dropTarget.hasClass('listMeasCalChecked')
    ) {
      e.preventDefault();

      var dropTargetClass = e.dropTarget.nextSibling.id;

      if (JSON.stringify(dropTargetClass).includes('listRows')) {
        if (this.nbRowsDropped <= 2) {
          this.PopulateDataListBox('listRows', item, e, item.parentNode());
          this.nbRowsDropped++;
        } else {
          this.showInfoRowHirarchy();
        }
      } else if (JSON.stringify(dropTargetClass).includes('listColum')) {
        if (this.nbColsDropped == 0) {
          this.PopulateDataListBox('listColum', item, e, item.parentNode());
          this.nbColsDropped++;
        } else {
          this.showInfoColHirarchy();
        }
      }
    } else if (
      dropTarget.hasClass('myTree k-widget k-treeview') &&
      dropTarget[0].id == 'treeviewFiltAtt'
    ) {
      e.preventDefault();
      this.populateFilterTreeView(
        'treeviewFiltAtt',
        item.text,
        e,
        item.parentNode().text
      );

     // this.nbFilterDropped++;
      //console.log(item.text);
      // console.log(item.parentNode().text);
    } else {
      e.preventDefault();
    }
  }

  async AvoidDragParentNode(e: any) {
    var treeviewListDimAttr = $('#treeview').data('kendoTreeView');
    var item = treeviewListDimAttr.dataItem(e.sourceNode);

    // Deny dragging if the item has children
    if (item.hasChildren) {
      e.preventDefault();
    }
  }

  async  applyFilterComponent(
    kendoCompId: string,
    kendoCompType: string,
    filterText: string
  ) {
    var kendoComponent = $(`#${kendoCompId}`).data(kendoCompType);
    var filterValue = filterText.toLowerCase();
    kendoComponent.dataSource.filter({
      field: 'text',
      operator: 'contains',
      value: filterValue,
    });
  }

  // Function to check if a string is in ISO date format
  isDate(dateString: string): boolean {
    var isoDatePattern = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}$/;
    return isoDatePattern.test(dateString);
  }
  async populateFilterTreeView(
    treeview: string,
    item: string,
    e: any,
    parentItemNode: string
  ) {
    this.PrincNode=e;
    this.isCustomFilterItems=false;
      this.kendoDialogSharedService.openCenteredWindow('dialog-filter-items');
      this.columnValData = {
        sqlServerInstance: this.olapCubeChoosen.sqlServerInstance,
        olapCubeName: this.olapCubeChoosen.olapCubeName,
        attribFiltFormatReport: '',
        dimensionParent: parentItemNode,
        attribute: item,
        startIndex: 0,
        endIndex: 1000,
      };
      this.getitemsFilter();

  }
  prepareAttRowQuery() {
    var listBoxRow = $('#listRows').data('kendoListBox').dataSource.data();
    var nbRow = listBoxRow.length;
    var rowQueryText = '';
   // var listHierarchyRows: hierarchyRow[] = [];
    listBoxRow.map(function (
      item: {
        parentTextNode: any;
        text: any;
      },
      index: number
    ) {
      rowQueryText +=
        index === 0
          ? `[${item.parentTextNode}].[${item.text}].children`
          : `,[${item.parentTextNode}].[${item.text}].members`;
     /* listHierarchyRows.push({
        rowName: item.text,
        levelHierNumber: index,
      });*/
    });
    return {
      rowQueryText: rowQueryText,
      nbRow: nbRow,
    //  listHierarchyRows: listHierarchyRows,
    };
  }
  prepareAttKpiColQuery() {
    var listBoxMeasCal = $('#listMeasCalChecked')
      .data('kendoListBox')
      .dataSource.data();
    var listBoxCol = $('#listColum').data('kendoListBox').dataSource.data();
    var nbCol = listBoxCol.length;
    var kpiColQueryText = '';
    var measCalChoosen = listBoxMeasCal.map(function (
      item: { text: any },
      index: number
    ) {
      kpiColQueryText += index === 0 ? `[${item.text}]` : `,[${item.text}]`;
      return item.text;
    });
    kpiColQueryText =
      listBoxCol.length == 0
        ? `{${kpiColQueryText}}`
        : `{${kpiColQueryText}}` +
          `,[${listBoxCol[0].parentTextNode}].[${listBoxCol[0].text}].members`;
    //return kpiColQueryText;
    return {
      kpiColQueryText: kpiColQueryText,
      nbCol: nbCol,
      measCalChoosen: measCalChoosen,
    };
  }
  pepareAttFilterQuery() {
    var treeViewFilter = $(`#treeviewFiltAtt`)
      .data('kendoTreeView')
      .dataSource.data();
    var filterQueryText = '';
    if (treeViewFilter.length != 0) {
      treeViewFilter.map((parentNode: any, indexParentNode: number) => {
        var attForm = this.filterItems(parentNode.items);

        filterQueryText +=
          indexParentNode == 0 ? `{ ${attForm}}` : `,{${attForm}}`;
      });
    }
    return filterQueryText;
  }
  filterItems(items: any) {
    var filterFormatted = '';
    items.map(function (item: any, indexItems: number) {
      filterFormatted +=
        indexItems === 0 ? item.originalText : `,${item.originalText}`;
    });
    return filterFormatted;
  }
  showSummaryDialog() {
    const dialog = $('#dialog')
      .kendoDialog({
        width: '400px',
        height: '300px',
        title: this.titleDialog,
        content: '', //$('#dialogContent').html(),
        visible: false, // Initially hide the dialog
        modal: true, // Make it a modal dialog
        closable: true, // Allow users to close the dialog
        actions: [
          {
            text: ' <i class="fas fa-check"></i>' + this.oKButtonText,
            primary: true, // Indicates the primary action (e.g., Enter key)
            action: this.okDialog.bind(this),
          },
         {
            text: ' <i class="fas fa-times"></i>' + this.CancelButtonText,
            action: function (e: any) {
              // Handle Cancel button click here
              $('#dialog').data('kendoDialog').close();
            },
          },
        ],
      })
      .data('kendoDialog');
    // Reset the content to empty
    dialog.content('');
    // Load new HTML content into the Dialog
    dialog.content($('#dialogContent').html());
    var nbColumn = this.sharedListBoxServiceMethod.getItemsListBox(
      'listColum',
      'kendoListBox'
    ).length;
    this.olapCubeChoosen.attribFiltFormatReport = this.pepareAttFilterQuery();
    if (nbColumn == 0) {
      // important modified
      this.olapCubeChoosen.ValueColumnFiltered="";
      this.olapCubeChoosen.measCalChoosen =
        this.prepareAttKpiColQuery().measCalChoosen.map((kpi: string) =>
          this.cleanSpecCharDec(kpi)
        );
       /* this.olapCubeChoosen.colSmartGrid =this.sharedMethodService.
        prepareColumnReport(this.olapCubeChoosen.colSmartGrid,this.prepareAttKpiColQuery().measCalChoosen);*/
      this.olapCubeChoosen.colSmartGrid =
        this.prepareAttKpiColQuery().measCalChoosen.map((kpi: string) => {
          return {
            field: this.cleanSpecCharDec(kpi),
            title: kpi,
            columns: null,
            width: "150px",
            format:this.olapCubeChoosen.olapCubeCalculations.length==0?this.kendoChartService.formatRound3:this.searchFomratCalculation(kpi)
          };
        });
      this.olapCubeChoosen.colSmartGrid.unshift(this.newPosition);
     console.log("aaaa",this.olapCubeChoosen.colSmartGrid );

      dialog.open();
    } else {
      var treeViewFilter = $(`#treeviewFiltAtt`).data('kendoTreeView').dataSource.data();
      if (treeViewFilter.length != 0) {
        this.showErrorNoticeColNumber() ;
      }
      var listBoxCol = $('#listColum').data('kendoListBox').dataSource.data();
      this.columnValData = {
        sqlServerInstance: this.olapCubeChoosen.sqlServerInstance,
        olapCubeName: this.olapCubeChoosen.olapCubeName,
        attribFiltFormatReport: this.olapCubeChoosen.attribFiltFormatReport,
        dimensionParent: listBoxCol[0].parentTextNode,
        attribute: listBoxCol[0].text,
        startIndex: 0,
        endIndex: 1000,
      };
      console.log('list filter,', this.olapCubeChoosen.attribFiltFormatReport);
      console.log('list columnvaldata', this.columnValData);
     this.getDataColumns();
      this.sharedListBoxServiceMethod.emptyKendoListBox(
        'list-result-filtered-column',
        'kendoListBox'
      );
      this.nbFilteredCol = 0;
      this.kendoDialogSharedService.openCenteredDialog('dialog-filter-column');
    }
  }
  searchFomratCalculation(kpi:any):any{
  /*  var formatString:any;
    this.olapCubeChoosen.olapCubeCalculations.some((item:any) => {
      if(kpi==item.calculationName){
        if(item.formatString=="Percent"){
          formatString= "{0:p}";
          return  formatString;
        }
        else if(item.formatString=="Currency"){
          formatString= "{0:c}";
          return  formatString
        }
        else{
          formatString= null;
          return   formatString;

        }
      }
    });*/
    let formatString = this.kendoChartService.formatRound3; // Default to null if no match is found
    for (const item of this.olapCubeChoosen.olapCubeCalculations) {
      if (kpi === item.calculationName) {
        if (item.formatString === "Percent") {
          formatString = this.kendoChartService.formatPercent;
        } else if (item.formatString === "Currency") {
          formatString = this.kendoChartService.formatCurrency;
        }
        break; // Exit the loop once the match is found and format is set
      }
    }

    return formatString;


  }
  prepareInfoReport() {
    this.olapCubeChoosen.attribRowsFormatReport =
      this.prepareAttRowQuery().rowQueryText;
    this.olapCubeChoosen.nbRowInQuery = this.prepareAttRowQuery().nbRow;
   /* this.olapCubeChoosen.listHirearchyRows =
      this.prepareAttRowQuery().listHierarchyRows;*/
    this.olapCubeChoosen.attribKpiColFormatReport =
      this.prepareAttKpiColQuery().kpiColQueryText;
    this.olapCubeChoosen.nbColInQuery = this.prepareAttKpiColQuery().nbCol;
    this.sharedService.setCubeOlapChoosen(this.olapCubeChoosen);
    this.router.navigate(['dashboard/smartGrid']);
  }
  okDialog(e: any) {
    $('#dialog').data('kendoDialog').close();
    this.prepareInfoReport();
    console.log('olap cube', this.olapCubeChoosen);
  }
  DisplayReport() {
    var treeViewFilterDimension = $(`#treeview`)
      .data('kendoTreeView')
      .dataSource.data();
    var listBoxMeasCalc = $(`#listMeasCalChecked`)
      .data('kendoListBox')
      .dataSource.data();

    if (this.nbRowsDropped == 0) {
      this.showErrorValidationRow();
    } else if (
      treeViewFilterDimension.length != 0 &&
      listBoxMeasCalc.length != 0
    ) {
      this.showSummaryDialog();
    }
  }
  removeFilterNodes() {
    this.loadingFilter = true;
    let childNodesChecked: number[] = []; // Initialize an empty string array
    var treeView = $('#treeviewFiltAtt').data('kendoTreeView');
    var checkedNodes = treeView.dataSource
      .view()
      .filter((node: any) => node.checked !== undefined);
    // Iterate through the checked nodes and store their UIDs
    checkedNodes.forEach((item: any) => {
      if (item.checked == true) {
        var bar = treeView.findByUid(item.uid);
        treeView.remove(bar);
        this.enableItemTreeView(item.text, item.textDimParent, 'treeview');
        this.nbFilterDropped--;
        //console.log(item);
      } else {
        item.items.forEach((item2: any) => {
          if (typeof item2.checked !== 'undefined' && item2.checked === true) {
            childNodesChecked.push(item2.uid);
          }
        });
      }
    });
    if (childNodesChecked.length != 0) {
      // Iterate through the list of UIDs and remove the corresponding nodes
      childNodesChecked.forEach((uid) => {
        var bar = treeView.findByUid(uid);
        treeView.remove(bar);
      });
    }
    this.loadingFilter = false;
  }

  showInfoRowHirarchy() {
    this.controlNumberRow = true;
    setTimeout(() => {
      this.controlNumberRow = false;
    }, 3000); // 3000 milliseconds (3 seconds)
  }
  showInfoColHirarchy() {
    this.controlNumberCol = true;
    setTimeout(() => {
      this.controlNumberCol = false;
    }, 3000); // 3000 milliseconds (3 seconds)
  }
  showErrorValidationRow() {
    this.controlValidationRowSelected = true;
    setTimeout(() => {
      this.controlValidationRowSelected = false;
    }, 3000); // 3000 milliseconds (3 seconds)
  }

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
  ////////////////////////////////////////////////////////////////////////////////////////////////////////
  handlePageColumn(event: PageEvent) {
    this.sharedListBoxServiceMethod.emptyKendoListBox('list-filtered-column','kendoListBox');
    this.sharedListBoxServiceMethod.UnselectAllListBox('list-filtered-column','kendoListBox');
    var pageSize = event.pageSize;
    var pageIndex = event.pageIndex;
    var startIndex = pageIndex * pageSize;
    var endIndex = startIndex + pageSize;
    console.log(
      `Clicked page ${pageIndex + 1}. Range: ${startIndex} - ${endIndex}`
    );
    // You can use startIndex and endIndex to perform actions or update data accordingly
    this.columnValData.startIndex = startIndex;
    this.columnValData.endIndex = 1000;
    console.log('list columnvaldata', this.columnValData);
   this.getDataColumns();
  }
  handlePageFilter(event: PageEvent) {
    var pageSize = event.pageSize;
    var pageIndex = event.pageIndex;
    var startIndex = pageIndex * pageSize;
    var endIndex = startIndex + pageSize;
    console.log(
      `Clicked page ${pageIndex + 1}. Range: ${startIndex} - ${endIndex}`
    );
    this.columnValData.startIndex = startIndex;
    this.columnValData.endIndex = 1000;
    console.log('list columnvaldata', this.columnValData);
   this.getitemsFilter();
  }
  cancelDialog(dialogComp: any) {
    this.kendoDialogSharedService.cancelDialog(dialogComp);
  }
  cancelWindow(dialogComp: any) {
    this.listFilterItems.items=[];
    this.filteredItemslist=[];
    this.kendoDialogSharedService.cancelWindow(dialogComp);
  }
  getDataColumns() {
    this.nbColumnReport = 0;
    this.loadingAttCol = true;
    this.isPaginatorDiabled = true;
    this.wizardCubeService.GetMdxQueryColumnsVAl(this.columnValData).subscribe({
      next: (successResponse) => {
        this.sharedMethodService.populateKendoComponent(
          successResponse.listColResponse,
          'list-filtered-column',
          'kendoListBox'
        );
        this.matPaginatorLength = successResponse.totalCount;
        this.loadingAttCol = false;
        this.isPaginatorDiabled = false;
        this.nbColumnReport = successResponse.listColResponse.length;
      },
      error: (errorResponse) => {
        console.log(errorResponse);
        this.sharedMethodService.showSnackbar(
          'Error contact Admin',
          'Error!',
          ''
        );
        this.loadingAttCol = false;
        this.isPaginatorDiabled = false;
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

  transferItem() {

    var listBoxFilterColumn = this.sharedMethodService.callKendoComponent(
      'list-filtered-column',
      'kendoListBox'
    );
    var listBoxResult = this.sharedMethodService.callKendoComponent(
      'list-result-filtered-column',
      'kendoListBox'
    );
    var selectedItems = listBoxFilterColumn.select();

    if (selectedItems.length > 0) {
     selectedItems.toArray().map((item: any) => {
       var cleanVAl= listBoxFilterColumn.dataItem(item).cleanVal
        if (!this.sharedListBoxServiceMethod.chkeckExistanceItemsListBox(cleanVAl, listBoxResult,'cleanVal')) {
          if (this.nbFilteredCol < this.numberMaxColumn) {
            this.nbFilteredCol++;
            this.nbColumnReport--;
            listBoxResult.add(listBoxFilterColumn.dataItem(item));
            listBoxFilterColumn.remove(item);
          } else {
            this.showErrorDepassedColFiltValue();
            return;
          }
        }
        else {
          this.mesgEmptySelectedCol=this.itemExist;
          this.showInfoEmptySelectedValue();
       }

      });
    } else {
      this.mesgEmptySelectedCol='Please Select column Value!';
      this.showInfoEmptySelectedValue();
    }
  }

  removeEventFromListBox() {
    this.sharedListBoxServiceMethod.removeListBox.subscribe((dataItem: any) => {
      if (dataItem.sender.element[0].id == 'list-filtered-column') {
        this.nbColumnReport -= dataItem.dataItems.length;
      } else {
        this.nbFilteredCol -= dataItem.dataItems.length;
      }
    });
  }
  emptyListBox() {
    this.sharedListBoxServiceMethod.emptyKendoListBox(
      'list-result-filtered-column',
      'kendoListBox'
    );
    this.nbFilteredCol = 0;
  }
  selectAllListBox(listBoxId: any) {
    this.sharedListBoxServiceMethod.SelectAllListBox(listBoxId, 'kendoListBox');
  }
  UnselectAllListBox(listBoxId: any) {
    this.sharedListBoxServiceMethod.UnselectAllListBox(
      listBoxId,
      'kendoListBox'
    );
  }
  prepareColumnFilter(
    kpi: any,
    itemslistResFilt: any[],
    listTotalOff: any[],
    includeQueryColumn: boolean
  ) {
    var colCombKpiAttCol: any[] = [];
    var cleanKPi = this.cleanSpecCharDec(kpi);
    var TotalOffCleanKpi = 'TotalOf' + cleanKPi;
    this.olapCubeChoosen.measCalChoosen.push(TotalOffCleanKpi);
    itemslistResFilt.map((colItem: any, index: number) => {
      var cleanAttCol = this.cleanSpecCharDec(colItem.cleanVal);
      var ReskpiCol =  cleanKPi+'_' +cleanAttCol ;
      this.olapCubeChoosen.measCalChoosen.push(ReskpiCol);
      colCombKpiAttCol.push({
        field: ReskpiCol,
        title: colItem.cleanVal,
        columns: null,
        width: "150px",
        format:this.olapCubeChoosen.olapCubeCalculations.length==0?this.kendoChartService.formatRound3:this.searchFomratCalculation(kpi)
      });
      if (includeQueryColumn == true) {
        this.olapCubeChoosen.ValueColumnFiltered +=
          index == 0 ? ` ${colItem.originalVal}` : `,${colItem.originalVal}`;
      }
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
      format:this.olapCubeChoosen.olapCubeCalculations.length==0?this.kendoChartService.formatRound3:this.searchFomratCalculation(kpi)

    });
  }
  visualizeReport() {
    if(!this.sharedListBoxServiceMethod.checkIfListBoxIsEmpty('list-result-filtered-column','kendoListBox')){
      this.olapCubeChoosen.measCalChoosen = [];
      this.olapCubeChoosen.colSmartGrid = [];
      this.olapCubeChoosen.ValueColumnFiltered = '';
      var listTotalOff: any[] = [];
      var itemslistResFilt = this.sharedListBoxServiceMethod.getItemsListBox(
        'list-result-filtered-column',
        'kendoListBox'
      );
      var FirstIteration = true;
      this.prepareAttKpiColQuery().measCalChoosen.map((kpi: any) => {
        this.prepareColumnFilter(
          kpi,
          itemslistResFilt,
          listTotalOff,
          FirstIteration
        );
        FirstIteration = false;
      });
      this.olapCubeChoosen.colSmartGrid.unshift(this.newPosition);
      this.olapCubeChoosen.colSmartGrid = [
        ...this.olapCubeChoosen.colSmartGrid,
        ...listTotalOff,
      ];
      this.prepareInfoReport();

      console.log('olap cube', this.olapCubeChoosen);
    }
    else{
      this.showErrorFiltColEMpty();

    }

  }


  emptyParamReport() {
    this.olapCubeChoosen.attribRowsFormatReport = '';
    this.olapCubeChoosen.attribKpiColFormatReport = '';
    this.olapCubeChoosen.attribFiltFormatReport = '';
    this.olapCubeChoosen.nbRowInQuery = 0;
    this.olapCubeChoosen.nbColInQuery = 0;
    this.olapCubeChoosen.listHirearchyRows = [];
    this.olapCubeChoosen.colSmartGrid = [];
    this.olapCubeChoosen.InterpretationReport = '';
    this.olapCubeChoosen.ValueColumnFiltered = '';
    //this.olapCubeChoosen.measCalChoosen=[]
  }
  //  *************related about column dialog choice
  showInfoEmptySelectedValue() {
    this.emptySelectedColVal = true;
    setTimeout(() => {
      this.emptySelectedColVal = false;
    }, 2000); // 3000 milliseconds (3 seconds)
  }
  showErrorDepassedColFiltValue() {
    this.ctrlValidNumbColValFilt = true;
    setTimeout(() => {
      this.ctrlValidNumbColValFilt = false;
    }, 3000); // 3000 milliseconds (3 seconds)
  }
  showErrorFiltColEMpty() {
    this.ctrlValidEmptyColFilt = true;
    setTimeout(() => {
      this.ctrlValidEmptyColFilt = false;
    }, 3000); // 3000 milliseconds (3 seconds)
  }
  showErrorNoticeColNumber() {
    this.ctrlValidNoticeColNumber = true;
    setTimeout(() => {
      this.ctrlValidNoticeColNumber  = false;
    }, 7000); // 3000 milliseconds (3 seconds)
  }
  ///**------------------------------ */


  selectAllItems(checked: boolean) {
   /* this.filteredListMeasDimCal.forEach((item) => {
      item.selected = checked;
    });
    this.updateSelectedCount();*/
  }
  initializeitemsFilter() {
   this.columnValData= {
      sqlServerInstance: '',
      olapCubeName: '',
      attribFiltFormatReport: '',
      dimensionParent: '',
      attribute: '',
      startIndex: 0,
      endIndex: 0,
    };
   }
   customFilterItems(){
    var treeView = $('#treeviewFiltAtt').data('kendoTreeView');
    var item = treeView.dataItem(treeView.select());
    console.log('mo item',item);
    if(item!= undefined && item.hasChildren==true){

            this.listFilterItems.items=[];
          this.filteredItemslist=[];
          this.kendoDialogSharedService.openCenteredWindow('dialog-filter-items');
          this.isCustomFilterItems=true;
          this.initializeitemsFilter();
          this.columnValData = {
            sqlServerInstance: this.olapCubeChoosen.sqlServerInstance,
            olapCubeName: this.olapCubeChoosen.olapCubeName,
            attribFiltFormatReport: '',
            dimensionParent: item.textDimParent,
            attribute: item.text,
            startIndex: 0,
            endIndex: 1000,
          };
          this.getitemsFilter();

    }
  }
  getitemsFilter(){
    this.allChecked=false;
    this.filterText= '';
    this.loadingAttFilterItems = true;
    this.nbFilterItemsReport=0;
    this.isPaginatorDiabled = true;
    this.wizardCubeService.GetMdxQueryFiltersVAl(this.columnValData).subscribe({
      next: (successResponse) => {
        this.listFilterItems=successResponse.filtItemsResponse;
        this.filteredItemslist=successResponse.filtItemsResponse.items;
      this.matPaginatorLength = successResponse.totalCount;
        this.loadingAttFilterItems = false;
       this.nbFilterItemsReport = successResponse.filtItemsResponse.items.length;
       this.isPaginatorDiabled = false;
      },
      error: (errorResponse) => {
        console.log(errorResponse);
        this.sharedMethodService.showSnackbar(
          'Error contact Admin',
          'Error!',
          ''
        );
        this.loadingAttFilterItems = false;
        this.isPaginatorDiabled = false;

      },
    });
    //********************465465465***********************

    //***946545465465*/
  }
  resultFilterItems(){
    this.itemsFilteredChecked ={
      text: this.columnValData.attribute,
      textDimParent:  this.columnValData.dimensionParent,
      expanded: true,
      selected:false,
      items:this.listFilterItems.items
      .filter(item => item.selected)
    }
    if(this.itemsFilteredChecked.items.length!=0){
      this.loadingFilter = true;
      var filterTreeView =this.sharedMethodService.callKendoComponent('treeviewFiltAtt','kendoTreeView');
      if(this.isCustomFilterItems==false){
        filterTreeView.dataSource.add(this.itemsFilteredChecked);
        $('#treeview').data('kendoTreeView').enable(this.PrincNode.sourceNode, false);
        this.nbFilterDropped++;
      }
      else{

        var treeView =this.sharedMethodService.callKendoComponent('treeviewFiltAtt','kendoTreeView');
        var item = treeView.dataItem(treeView.select());
         console.log('mo item',item);
        this.itemsFilteredChecked.items.filter(item => item.selected)
        .map(filteredItem => {
          if(!this.checkExistanceItemTreeView(filteredItem.text,item.items))
          {
          item.append(filteredItem);
          }
          else {
            console.log('false item existtttt',filteredItem);
          }
        });
      }
      this.cancelWindow("dialog-filter-items");
      this.loadingFilter = false;
      console.log('testtt',this.itemsFilteredChecked);
    }
    else{
      console.log('empy choice ');
      this.ctrValdCutomfilter=true;
      setTimeout(() => {
        this.ctrValdCutomfilter = false;
      },3000);
     // this.alertErrorComponent.showError();

    }


  }

  updateAllChecked() {
    this.allChecked= this.listFilterItems.items != null && this.listFilterItems.items.every(t => t. selected);
  }
  someChecked(): boolean {
    if (this.listFilterItems.items == null) {
      return false;
    }
    return this.listFilterItems.items.filter(t => t. selected).length > 0 && !this.allChecked;
  }

  setAll(completed: boolean) {
    this.allChecked = completed;
    if ( this.listFilterItems.items== null) {
      return;
    }
    this.listFilterItems.items.forEach(t => (t.selected = completed));
  }
  applyFilter() {
    this.filteredItemslist = this.listFilterItems.items.filter((item) =>
      item.text.toLowerCase().includes(this.filterText.toLowerCase())
    );
  }
  getSelectedItemCount(): number {
    if (this.listFilterItems.items == null) {
      return 0;
    }
    return this.listFilterItems.items.filter(t => t.selected).length;
  }
  checkExistanceItemTreeView(itemSearched: any,listItems:any[]):boolean{
    var isExist = false;
    listItems.map((item: any) => {
      if(item.text==itemSearched){
        isExist=true;
        return;
      }
    })
    return isExist;
  }

}
