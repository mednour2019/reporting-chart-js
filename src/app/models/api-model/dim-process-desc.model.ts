import { olapCalcChoosen } from "./calculation-cube/olap-calculation-choosen.model";
import { dimension } from "./dimension.model";

export interface DimensionToProcessRequest {
  dimToUpdate: dimension,
  olapCube: olapCalcChoosen,
}
