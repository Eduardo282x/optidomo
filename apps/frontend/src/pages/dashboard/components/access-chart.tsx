import React from 'react'
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    Legend,
    CartesianGrid
} from 'recharts'

type AccessLog = {
    user: string
    area: string
    type: string // "ENTRADA" | "SALIDA"
    time: string // "HH:MM"
    date: Date
}

type AccessChartData = {
    time: string
    ENTRADA: number
    SALIDA: number
}

type Props = {
    data: AccessLog[]
}

export const AccessChart: React.FC<Props> = ({ data }) => {
    const grouped: Record<string, AccessChartData> = {}

    data.forEach(log => {
        const time = log.time
        if (!grouped[time]) {
            grouped[time] = { time, ENTRADA: 0, SALIDA: 0 }
        }

        if (log.type === 'ENTRADA') {
            grouped[time].ENTRADA += 1
        } else if (log.type === 'SALIDA') {
            grouped[time].SALIDA += 1
        }
    })

    const chartData: AccessChartData[] = Object.values(grouped).sort(
        (a, b) => a.time.localeCompare(b.time)
    )

    return (
        <div className="w-full h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="time" />
                    <YAxis allowDecimals={false} />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="ENTRADA" fill="#4ade80" />
                    <Bar dataKey="SALIDA" fill="#f87171" />
                </BarChart>
            </ResponsiveContainer>
        </div>
    )
}
