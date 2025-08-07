import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"

export const dataBaseArea = [
    { area: "Entrada", energy: 25 },
    { area: "Salon 1", energy: 45 },
    { area: "Salon 2", energy: 65 },
    { area: "Comedor", energy: 35 },
]

export interface AreaConsumptionChartProps {
    data: {
        area: string,
        energy: number
    }[]
}

export const AreaConsumptionChart = ({ data }: AreaConsumptionChartProps) => {
    return (
        <ResponsiveContainer width="100%" height="100%">
            <BarChart
                data={data}
                margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 5,
                }}
            >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="area" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="energy" fill="#22c55e" />
            </BarChart>
        </ResponsiveContainer>
    )
}

