export interface IArea extends AreaBody {
    id: number;
}

export interface GroupAreas {
    allAreas: IArea[],
    areas: IArea[]
}

export interface AreaBody {
    name: string;
}

