import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { AddReportRequest } from 'src/app/models/api-model/Report/AddReportRequest.model';
import { ApplicationUser } from 'src/app/models/api-model/authentication/ApplicationUser';
import { olapCubeChoosen } from 'src/app/models/api-model/olap-cube-choosen.model';

@Injectable({
  providedIn: 'root'
})
export class SharedService {
   // private clickSubject = new Subject<void>();
   private dateChangeSubject = new Subject<{ startDate: Date, endDate: Date,btnId: string }>();
   dateChangeEvent$ = this.dateChangeSubject.asObservable();
   emitDateChangeEvent(startDate: Date, endDate: Date,btnId: string) {
    this.dateChangeSubject.next({ startDate, endDate,btnId });
  }
    // Observable to subscribe to click events
    /*clickEvent$ = this.clickSubject.asObservable();
    // Method to emit click events
    emitClickEvent() {
        this.clickSubject.next();
    }*/

    private storageKey = 'cubeOlapChoosen';
    private storageKeyReport = 'reportOlapCube';
    private storageKeyUser = 'User';
    olapCubeChoosen!: olapCubeChoosen;
    reportOlap!:AddReportRequest;
    user!:ApplicationUser;
    // related about disable button
    private disableButton = false;
    private readonly storageKeyBtn = 'disableButton';
    //////////////////////////////////
   
  constructor() {
    var  storedData = localStorage.getItem(this.storageKey);
    var  storedDataReport = localStorage.getItem(this.storageKeyReport);
    var  storedDataUser = localStorage.getItem(this.storageKeyUser);
    


    if (storedData) {
      this.olapCubeChoosen = JSON.parse(storedData);
    }
    if (storedDataReport) {
        this.reportOlap = JSON.parse(storedDataReport);
      }
    if (storedDataUser) {
        this.user = JSON.parse(storedDataUser);
      }
   }
   setDisableButton(value: boolean) {
   // this.disableButton = value;
   localStorage.setItem(this.storageKeyBtn, JSON.stringify(value));

  }
  getDisableButton() {
    const storedValue = localStorage.getItem(this.storageKeyBtn);
    return storedValue ? JSON.parse(storedValue) : false;
    //return this.disableButton;
  }
   setCubeOlapChoosen(cubeOlapChoosen: olapCubeChoosen) {
    this.olapCubeChoosen = cubeOlapChoosen;
    localStorage.setItem(this.storageKey, JSON.stringify(cubeOlapChoosen));
  }
  setReportOlap(reportOlap:AddReportRequest) {
    this.reportOlap = reportOlap;
    localStorage.setItem(this.storageKeyReport, JSON.stringify(reportOlap));
  }
  setUser(user:ApplicationUser) {
    this.user = user;
    localStorage.setItem(this.storageKeyUser, JSON.stringify(user));
  }
  /*clearCubeOlapChoosen() {
    this.olapCubeChoosen=null;
    localStorage.removeItem(this.storageKey);
  }*/
}
