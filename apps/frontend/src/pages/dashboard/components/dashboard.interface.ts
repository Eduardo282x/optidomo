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
    }[],
    access: IAccessLog[]
}


export interface IAccessLog {
    user: string;
    area: string;
    type: string;
    time: string;
    date: Date;
}
