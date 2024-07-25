import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment.development';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { server } from 'src/app/models/api-model/server.model';
import { of } from 'rxjs';
import { cubeName } from 'src/app/models/api-model/cubename.model';
import { olapCubeChoosen } from 'src/app/models/api-model/olap-cube-choosen.model';
import { dimension } from 'src/app/models/api-model/dimension.model';
import { measure } from 'src/app/models/api-model/measure.model';
import { calculation } from 'src/app/models/api-model/calculation.model';
import { dimAttribute } from 'src/app/models/api-model/dimAttribute.model';
import { attributeVal } from 'src/app/models/api-model/attributeval.model';
import { colsmartgrid } from 'src/app/models/api-model/colsmartgrid.model';
import { calculationAttribute } from 'src/app/models/api-model/calculation-cube/cal-attribute.model';
import { columnGrid } from 'src/app/models/api-model/calculation-cube/col-grid.model';
import { CalculationRequest } from 'src/app/models/api-model/calculation-cube/calcul-request.model';
import { DimensionToProcessRequest } from 'src/app/models/api-model/dim-process-desc.model';
import { MeasureToProcessRequest } from 'src/app/models/api-model/meas-process-desc.model';
import { CubeToProcessRequest } from 'src/app/models/api-model/cube-process-desc.model';
import { columnValData } from 'src/app/models/api-model/ColumnValData/column-val-data.model';
import { columnValResponse } from 'src/app/models/api-model/ColumnValData/column-val-response.model';
import { existanceCalculation } from 'src/app/models/api-model/calculation-cube/existance-calculation.model';

@Injectable({
  providedIn: 'root',
})
export class WizardCubeService {
  private baseApiUrl = environment.baseApiUrl;
  constructor(private httpClient: HttpClient) {}


  getSqlServersNames(): Observable<server[]> {
    return this.httpClient.get<server[]>(
      this.baseApiUrl + '/cube/sqlInstances'
    );
    //return of(this.dropdownData);
  }

  getOlapCubesName(olapCubeChoosen: olapCubeChoosen): Observable<cubeName[]> {
    return this.httpClient.put<cubeName[]>(
      this.baseApiUrl + '/cube/olapCubeName',
      olapCubeChoosen
    );
  }
  getMeasDimCalc(
    cubeOlap: olapCubeChoosen): Observable<{ listDimensions: dimension[];listMeasures: measure[];listCalculations:calculationAttribute[] }> {
    return this.httpClient.put<{ listDimensions: dimension[]; listMeasures: measure[];listCalculations:calculationAttribute[] }>(
      this.baseApiUrl + '/cube/olapDimMeasCalc',cubeOlap);
  }
  getAttribDimName(olapCubeChoosen: olapCubeChoosen): Observable<dimAttribute[]> {
    return this.httpClient.put<dimAttribute[]>(
      this.baseApiUrl + '/cube/olapAttribDimName',
      olapCubeChoosen
    );
  }
    getAttribVal(olapCubeChoosen: olapCubeChoosen, dimensionParent: string, attribute: string): Observable<attributeVal> {

    return this.httpClient.put<attributeVal>(
      `${this.baseApiUrl}/cube/execute/${dimensionParent}/${attribute}`,olapCubeChoosen

    );
}
showSmartGridReport(olapCubeChoosen: olapCubeChoosen): Observable<{ listMdx: any[]; listColGrid: colsmartgrid[]; }>{
  return this.httpClient.put<{ listMdx: any[]; listColGrid: colsmartgrid[]; }>(
    this.baseApiUrl + '/cube/showGridReport2',
    olapCubeChoosen
  );
}
getCalculationData(olapCubeChoosen: olapCubeChoosen): Observable<calculationAttribute[]>{
  return this.httpClient.put<calculationAttribute[]>(
    this.baseApiUrl + '/cube/Calculations',
    olapCubeChoosen
  );
}
getMeasures(olapCubeChoosen: olapCubeChoosen): Observable<measure[]>{
  return this.httpClient.put<measure[]>(
    this.baseApiUrl + '/cube/Measures',
    olapCubeChoosen
  );
}
processCalculationData(requestCalculation: CalculationRequest):Observable<any>{
  return this.httpClient.post<any>(
    this.baseApiUrl + '/cube/Process-Calc-Data',
    requestCalculation
  );
}
/*removeCalculationData(requestCalculation: CalculationRequest):Observable<any>{
  return this.httpClient.post<any>(
    this.baseApiUrl + '/cube/remove-Calc-Data',
    requestCalculation
  );
}*/
/*checkExistanceCalculationData(existCalData: existanceCalculation):Observable<any>{
  return this.httpClient.post<any>(
    this.baseApiUrl + '/cube/exist-Calc-Data',
    existCalData
  );
}*/
getDimensions(olapCubeChoosen: olapCubeChoosen): Observable<dimension[]>{
  return this.httpClient.put<dimension[]>(
    this.baseApiUrl + '/cube/Dimensions',
    olapCubeChoosen
  );
}

processDimensionDescription(dimToProcessRequest:DimensionToProcessRequest):Observable<any>{
  return this.httpClient.post<any>(
    this.baseApiUrl + '/cube/Process-dimDesc',
    dimToProcessRequest
  );
}
processMeasureDescription(measToProcessRequest:MeasureToProcessRequest):Observable<any>{
  return this.httpClient.post<any>(
    this.baseApiUrl + '/cube/Process-measDesc',
    measToProcessRequest
  );
}
processCubeDescription(cubeToProcessRequest:CubeToProcessRequest):Observable<any>{
  return this.httpClient.post<any>(
    this.baseApiUrl + '/cube/Process-cubeDesc',
    cubeToProcessRequest
  );
}


/*showSmartGridReportOdata(olapCubeChoosen: olapCubeChoosen): Observable<{ listMdx: any[]; listColGrid: colsmartgrid[]; }>{
  return this.httpClient.post<{ listMdx: any[]; listColGrid: colsmartgrid[]; }>(
    this.baseApiUrl + '/cube/showGridReportOdata',
    olapCubeChoosen
  );
}*/
showSmartGridReportOdata(olapCubeChoosen: olapCubeChoosen): Observable<any[]>{
  return this.httpClient.put<any[]>(
    this.baseApiUrl + '/cube/showGridReportOdata',
    olapCubeChoosen
  );
}

GetMdxQueryColumnsVAl(colValData: columnValData): Observable<{ listColResponse: columnValResponse[]; totalCount: any; }>{
  return this.httpClient.put<{ listColResponse: columnValResponse[]; totalCount: any; }>(
    this.baseApiUrl + '/cube/mdx-query-col-val',
    colValData
  );
}

GetMdxQueryFiltersVAl(colValData: columnValData): Observable<{ filtItemsResponse: attributeVal; totalCount: any; }>{
  return this.httpClient.put<{ filtItemsResponse: attributeVal; totalCount: any; }>(
    this.baseApiUrl + '/cube/mdx-query-filter-val',
    colValData
  );
}
getTotalItemData(olapCubeChoosen: olapCubeChoosen): Observable<any>{
  return this.httpClient.post<any>(
    this.baseApiUrl + '/cube/grandTotalItemData',
    olapCubeChoosen
  );
}

ngOnInit(): void {}
}
