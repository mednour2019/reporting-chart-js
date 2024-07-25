import { responseReportPieChart } from "./response-report-pie-chart.model";

export interface responseReportColChart{
  name:string,
  data:responseReportPieChart,
  color:string,
  labels:labelChart
}
export interface  labelChart{
  visible :string,
  background:string,
  format:string,

}
