import { olapCubeChoosen } from "../olap-cube-choosen.model";
import { calculationAttribute } from "./cal-attribute.model";
import { olapCalcChoosen } from "./olap-calculation-choosen.model";

export interface CalculationRequest {
  listCalculToProcess: calculationAttribute[],
  olapCalcul: olapCalcChoosen,
}
