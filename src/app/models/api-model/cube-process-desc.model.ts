import { olapCalcChoosen } from "./calculation-cube/olap-calculation-choosen.model";
import { cubeName } from "./cubename.model";

export interface CubeToProcessRequest {
  cubeToUpdate: cubeName,
  olapCube: olapCalcChoosen,
}
