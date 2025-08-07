export interface DashBoardInterface {
    totalConsumptionLight: number;
    totalConsumptionAC: number;
    totalConsumption: number;
    chartDataEnergy: {
        time: string;
        energy: number;
    }[]
    chartDataArea: {
        area: string;
        energy: number;
    }[]
}
