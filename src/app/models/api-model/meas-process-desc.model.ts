import { olapCalcChoosen } from "./calculation-cube/olap-calculation-choosen.model";
import { measure } from "./measure.model";

export interface MeasureToProcessRequest {
  measToUpdate: measure,
  olapCube: olapCalcChoosen,
}
