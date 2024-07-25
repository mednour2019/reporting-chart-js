export interface ReportResponse{
   Id:string,
  ReportName:string,
InterpretationReport :string,
isSharebale:string,
sqlServerInstance :string,
 olapCubeName :string,
 measCalChoosen:string,
 attribRowsFormatReport:string,
 attribKpiColFormatReport :string,
 attribFiltFormatReport:string,
 nbRowInQuery:number,
 nbColInQuery :number,
 dateCreation:Date,
 dateUpdate:Date,
 valueColumnFiltered:string,
 calculations:string
}
