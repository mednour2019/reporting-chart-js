import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment.development';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { olapCubeChoosen } from 'src/app/models/api-model/olap-cube-choosen.model';
import { cubeName } from 'src/app/models/api-model/cubename.model';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class SharedApiMethodsService {
  private baseApiUrl = environment.baseApiUrl;

  constructor(private httpClient: HttpClient) { }
  getOlapCubesName(olapCubeChoosen: olapCubeChoosen): Observable<cubeName[]> {
    return this.httpClient.put<cubeName[]>(
      this.baseApiUrl + '/cube/olapCubeName',
      olapCubeChoosen
    );
  }
}
