import {ApplicationUser} from "../authentication/ApplicationUser";
import { olapCubeChoosen } from "../olap-cube-choosen.model";

/*export interface AddReportRequest extends olapCubeChoosen{
  ReportName:string,
  InterpretationReport:string,
  isSharebale:number,
 // sqlServerInstance :string,
  //olapCubeName :string,
  //measCalChoosen:string,
 // attribRowsFormatReport:string,
 // attribKpiColFormatReport:string,
 // attribFiltFormatReport:string,
 // nbRowInQuery:number,
 // nbColInQuery:number,
  UserId:string
}*/
export interface AddReportRequest extends Pick<olapCubeChoosen, 'sqlServerInstance' |
'olapCubeName' | 'attribRowsFormatReport' | 'attribKpiColFormatReport' |
 'attribFiltFormatReport' | 'nbRowInQuery' | 'nbColInQuery'|'ValueColumnFiltered'> {
  ReportName: string;
  InterpretationReport: string;
  isSharebale: number;
  UserId: string;
  measCalChoosen:string;
  calculations:string;
}
