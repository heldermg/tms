export interface IChartData {
  label: string
  data: number[]
  backgroundColor: string
}

export class ChartData implements IChartData {
  constructor(
    public label: string,
    public data: number[],
    public backgroundColor: string,
  ) {

  }
}