import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AddReportRequest } from 'src/app/models/api-model/Report/AddReportRequest.model';
import { ReportResponse } from 'src/app/models/api-model/Report/ReportResponse.model';
import { SharedReportRequest } from 'src/app/models/api-model/Report/SharedReportRequest.model';
import { UpdatedReportRequest } from 'src/app/models/api-model/Report/UpdatedReportRequest.model';
import { requestReportChart } from 'src/app/models/api-model/report-chart/request-report-chart.model';
import { responseReportColChart } from 'src/app/models/api-model/report-chart/response-report-col-chart.model';
import { responseReportPieChart } from 'src/app/models/api-model/report-chart/response-report-pie-chart.model';
import { environment } from 'src/environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class ReportOlapService {
  private baseApiUrl = environment.baseApiUrl;
  constructor(private httpClient: HttpClient) { }

  AddReport(report: AddReportRequest):Observable<any>{
    return this.httpClient.post<any>(
      this.baseApiUrl +'/OlapReport/Add',
      report
    );
  }
  GetReportByUserId(userId:string,sharebility:boolean,startDate:string,endDate:string):Observable<ReportResponse[]>{
    return this.httpClient.put<ReportResponse[]>(
     // this.baseApiUrl +'/OlapReport/GetReportsById',
      `${this.baseApiUrl}/OlapReport/GetReportsById/${userId}/${sharebility}/${startDate}/${endDate}`,
      userId

      //requestBody
    );
  }
  RemoveReportById(reportId:string):Observable<any>{
    return this.httpClient.post<any>(
      `${this.baseApiUrl}/OlapReport/RemoveById/${reportId}`,
      reportId

      //requestBody
    );
  }
  UpdateReport(reportToUpdate:UpdatedReportRequest):Observable<any>{
    return this.httpClient.post<any>(
      `${this.baseApiUrl}/OlapReport/UpdateReport`,
      reportToUpdate
    );
  }
  ShareReportByUsers(sharedReport:SharedReportRequest):Observable<any>{
    return this.httpClient.post<any>(
      `${this.baseApiUrl}/OlapReport/ShareReport`,
      sharedReport
    );
  }

  GetReportByIdPieCharts(requestReportChart:requestReportChart):Observable<responseReportPieChart[]>{
    return this.httpClient.put<responseReportPieChart[]>(
     // this.baseApiUrl +'/OlapReport/GetReportsById',
      `${this.baseApiUrl}/OlapReport/get-report-by-id-pie-chart`,
      requestReportChart

      //requestBody
    );
  }
  GetReportByIdColCharts():Observable<{reports:responseReportColChart[],max:number}>{
    return this.httpClient.get<{reports:responseReportColChart[],max:number}>(
     // this.baseApiUrl +'/OlapReport/GetReportsById',
      `${this.baseApiUrl}/OlapReport/get-report-by-id-col-chart`
      //requestBody
      );
  }
  GetShareabReportById(requestReportChart:requestReportChart):Observable<{reports:responseReportColChart[],max:number}>{
    return this.httpClient.put<{reports:responseReportColChart[],max:number}>(
     // this.baseApiUrl +'/OlapReport/GetReportsById',
      `${this.baseApiUrl}/OlapReport/get-shareb-rep`,
      requestReportChart
      //requestBody
      );
  }
}
