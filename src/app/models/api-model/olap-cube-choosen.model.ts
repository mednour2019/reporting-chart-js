import { calculationAttribute } from "./calculation-cube/cal-attribute.model";
import { colsmartgrid } from "./colsmartgrid.model";
import { hierarchyRow } from "./hierarchyRow.model";

export interface olapCubeChoosen{
  sqlServerInstance :string,
  olapCubeName :string,
olapCubeDimensions :string[],
 olapCubeMeasures :string[],
  olapCubeCalculations :calculationAttribute[],
  measCalChoosen:string[],
attribRowsFormatReport:string,
attribKpiColFormatReport:string,
attribFiltFormatReport:string,
nbRowInQuery:number,
nbColInQuery:number,
listHirearchyRows:hierarchyRow[],
InterpretationReport:string,
colSmartGrid:colsmartgrid[],
ValueColumnFiltered:string
}
