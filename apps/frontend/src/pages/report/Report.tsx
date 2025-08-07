import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
// import { Button } from "@/components/ui/button"
// import { Download } from "lucide-react"

import { AreaConsumptionChart } from "../dashboard/components/area-consumption"
import { EnergyConsumptionChart } from "../energy/Energy"
import { GenerateReport } from "./GenerateReport"
import { DashBoardInterface } from "../dashboard/components/dashboard.interface"
import { generateReport, getEnergyLogByDay } from "@/services/energy-log/energy-log.service"
// import { AccessChart } from "../dashboard/components/access-chart"

export function ReportsModule() {
    const [date, setDate] = useState<Date | undefined>(new Date())
    const [reportType, setReportType] = useState<'LIGHT' | 'AC' | 'ACCESS'>("LIGHT")

    const [dashBoarData, setDashBoarData] = useState<DashBoardInterface>()

    useEffect(() => {
        getDashBoarDataApi()
    }, [date])

    const getDashBoarDataApi = async () => {
        const today = new Date()
        const dateFilter = date != null ? date : today
        const response: DashBoardInterface = await getEnergyLogByDay(dateFilter.toString())
        setDashBoarData(response)
    }

    const generateReportApi = async () => {
        const today = new Date()
        const dateFilter = date != null ? date : today
        const response = await generateReport({ type: reportType, date: dateFilter })
        const url = URL.createObjectURL(response)
        const link = window.document.createElement("a")
        link.href = url
        link.download = `Reporte.xlsx`
        window.document.body.appendChild(link)
        link.click()
        window.document.body.removeChild(link)
        URL.revokeObjectURL(url)
    }
    const resetFilters = () => {
        setReportType('LIGHT')
        setDate(new Date)
    }

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold text-black">Reportes</h2>

            <GenerateReport
                date={date}
                setDate={setDate}
                reportType={reportType}
                setReportType={setReportType}
                onReset={resetFilters}
                onSubmit={generateReportApi}
            />

            <Card>
                <CardHeader>
                    <div className="flex justify-between items-center">
                        <CardTitle>
                            {reportType === "LIGHT" && "Reporte de consumo electrico"}
                            {reportType === "AC" && "Temperature Report"}
                            {reportType === "ACCESS" && "Access Control Report"}
                        </CardTitle>
                        {/* <Button variant="outline" size="sm">
                            <Download className="mr-2 h-4 w-4" />
                            Exportar
                        </Button> */}
                    </div>
                    <CardDescription>

                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-8">
                        <div className="h-[300px]">
                            {reportType === "LIGHT" && dashBoarData && <EnergyConsumptionChart data={dashBoarData.chartDataEnergy} />}
                            {reportType === "AC" && dashBoarData && <AreaConsumptionChart data={dashBoarData.chartDataArea} />}
                            {reportType === "ACCESS" && dashBoarData && (
                                <div className="flex items-center justify-center h-full text-muted-foreground">
                                    Solo disponible en excel
                                </div>
                            )}
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}

