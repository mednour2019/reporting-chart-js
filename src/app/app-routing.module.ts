import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from './app.component';

import { Dashboard1Component } from './components/private/dashboard1/dashboard1.component';
import { WizardCubeComponent } from './components/wizard-cube/wizard-cube.component';
import { ConfigurationSmartGridComponent } from './components/configuration-smart-grid/configuration-smart-grid.component';
import { DisplaySmartGridComponent } from './components/display-smart-grid/display-smart-grid.component';
import { AuthlayoutComponent } from './layout/authlayout/authlayout.component';
import { SigninComponent } from './components/public/authentification/signin/signin.component';
import { AuthGuard } from './_helpers/auth.guard';
import { StatisticsComponent } from './components/private/statistics/statistics.component';
import { CalculationInterfaceComponent } from './components/calculation-interface/calculation-interface.component';
import { ReportsComponent } from './components/reports/reports.component';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { ShareReportComponent } from './components/share-report/share-report.component';
import { ContactComponent } from './components/contact/contact.component';
import { DimensionDescrComponent } from './components/dimension-descr/dimension-descr.component';
import { MeasDescComponent } from './components/meas-desc/meas-desc.component';
import { CubeDescComponent } from './components/cube-desc/cube-desc.component';


/*const routes: Routes = [
  {
   path: '',
    component: AppComponent,
    canActivate: [AuthGuard],
    children: [
      { path: 'account', redirectTo: './components/public/authentification/signin', pathMatch: 'full' },
    ],
  },
  // { path: 'login', component: SigninComponent },
  {
    path: 'authentication',
    component: AuthlayoutComponent,
    loadChildren: () =>
      import('./components/public/authentification/authentication.module').then(
        (m) => m.AuthenticationModule
      ),
  },
  { path: '**', component: Page404Component },
];*/
/*const accountModule = () => import('./components/public/authentification/authentication.module').then(x => x.AuthenticationModule);
const routes: Routes = [
  { path: '', component: AppComponent, canActivate: [AuthGuard] },
  //{ path: 'users', loadChildren: usersModule, canActivate: [AuthGuard] },
  { path: 'account', loadChildren: accountModule },

  // otherwise redirect to home
  { path: '**', redirectTo: '' }
];*/
const routes: Routes = [
  { path: '', component: SigninComponent },
  { path: '', component: Dashboard1Component, canActivate: [AuthGuard] },
  { path: 'login', component: SigninComponent },
  {
    path: 'dashboard',
    component: Dashboard1Component,
    children: [
      {
        path: 'stat',
        component: StatisticsComponent,
      },
      {
        path: 'configuration',
        component: WizardCubeComponent,
        data: { title: 'Wizard Config' },
      },
      {
        path: 'prepData',
        component: ConfigurationSmartGridComponent,
        data: { title: 'Data Configuration' },
      },
      {
        path: 'smartGrid',
        component: DisplaySmartGridComponent,
        data: { title: 'Analysis Visualization' },
      },
      {
        path: 'calcul-interf',
        component: CalculationInterfaceComponent,
        data: { title: 'Calculation Interface' },
      },
      {
        path: 'report-interf',
        component: ReportsComponent,
        data: { title: 'Reports Interface' },
      },
      {
        path: 'share-report',
        component: ShareReportComponent,
        data: { title: 'Reports Interface' },
      },
      {
        path: 'contact',
        component: ContactComponent,
        data: { title: 'Users Contact' },
      },
      {
        path: 'group-desc',
        component: DimensionDescrComponent,
        data: { title: 'Group-Desc' },
      },
      {
        path: 'kpi-desc',
        component: MeasDescComponent,
        data: { title: 'kpi-Desc' },
      },
      {
        path: 'datasource-desc',
        component: CubeDescComponent,
        data: { title: 'Data source-Desc' },
      }
    ],
  },
  {
    path: '**',
    component: NotFoundComponent,
    data: { title: '404 Error Page' },
  },
];

@NgModule({
  //imports: [RouterModule.forRoot(routes, {})],
  imports: [RouterModule.forRoot(routes)],

  exports: [RouterModule],
})
export class AppRoutingModule {}
