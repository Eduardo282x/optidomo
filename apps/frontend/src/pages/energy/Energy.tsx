import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"

export const dataBase = [
    { time: "00:00", energy: 40 },
    { time: "02:00", energy: 30 },
    { time: "04:00", energy: 20 },
    { time: "06:00", energy: 27 },
    { time: "08:00", energy: 90 },
    { time: "10:00", energy: 120 },
    { time: "12:00", energy: 130 },
    { time: "14:00", energy: 140 },
    { time: "16:00", energy: 120 },
    { time: "18:00", energy: 100 },
    { time: "20:00", energy: 80 },
    { time: "22:00", energy: 50 },
]

interface EnergyConsumptionChartProps {
    data: {
        time: string;
        energy: number;
    }[]
}

export const EnergyConsumptionChart = ({ data }: EnergyConsumptionChartProps) => {
    return (
        <ResponsiveContainer width="100%" height="100%">
            <LineChart
                data={data}
                margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 5,
                }}
            >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="energy" stroke="#22c55e" activeDot={{ r: 8 }} />
            </LineChart>
        </ResponsiveContainer>
    )
}

