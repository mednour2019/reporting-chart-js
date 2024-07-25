import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { first } from 'rxjs';
import { AddReportRequest} from 'src/app/models/api-model/Report/AddReportRequest.model';
import { ApplicationUser } from 'src/app/models/api-model/authentication/ApplicationUser';
import { AuthenticationService } from 'src/app/services/authentication/authentication.service';
import { DataSharingService } from 'src/app/services/dataService.service';
import { SharedService } from 'src/app/services/shared/shared.service';
@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.css']
})
export class SigninComponent {
  loginForm!: FormGroup;
    loading = false;
    submitted = false;
    error = '';
    report: AddReportRequest={
      ReportName:'',
      InterpretationReport:'',
      isSharebale:0,
      sqlServerInstance :'',
      olapCubeName :'',
      measCalChoosen:'',
      attribRowsFormatReport:'',
      attribKpiColFormatReport:'',
      attribFiltFormatReport:'',
      nbRowInQuery:0,
      nbColInQuery:0,
      UserId:'',
      ValueColumnFiltered:'',
      calculations:'',

    };
    user:ApplicationUser={
      id:'',
      username:'',
      password:'',
      FirstName:'',
      LastName:'',
      AccessToken:''
    }
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private formBuilder: FormBuilder,
    private authenticationService: AuthenticationService,
    private sharedService: SharedService,

  ) {
     // redirect to home if already logged in
   /*  if (this.authenticationService.userValue) {
      this.router.navigate(['/']);
  }*/

  }
  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
  })
  }
   // convenience getter for easy access to form fields
   get f() { return this.loginForm.controls; }
   onSubmit() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.loginForm.invalid) {
        return;
    }

    this.loading = true;
    this.authenticationService.login(this.f['username'].value, this.f['password'].value)
        .pipe(first())
        .subscribe({
            next: (res) => {
                localStorage.setItem('accessToken',res.accessToken)
                localStorage.setItem('refreshToken',res.refreshToken)
              this.user={
                id:res.idUser,
                username:res.userName,
                FirstName:res.firstName,
                LastName:res.lastName
              }
              this.report.UserId=res.idUser;
               this.sharedService.setReportOlap(this.report);
               this.sharedService.setUser(this.user);
               console.log('res ',res);
               console.log('user is in sign ',this.user);
                this.router.navigate(['dashboard/stat']);
            },
            error: error => {
               // this.error = error;
               this.error ='Authentication Failed';
                this.loading = false;
            }
        });
}

}
