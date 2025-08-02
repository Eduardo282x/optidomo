import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { es } from "date-fns/locale";
import { Button } from "@/components/ui/button"

import { Download } from "lucide-react"
import { format } from "date-fns"

import { AreaConsumptionChart } from "../dashboard/components/area-consumption"
import { EnergyConsumptionChart } from "../energy/Energy"
import { GenerateReport } from "./GenerateReport"

export function ReportsModule() {
    const [date, setDate] = useState<Date | undefined>(new Date())
    const [reportType, setReportType] = useState("energy")
    const [reportPeriod, setReportPeriod] = useState("daily")

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold text-black">Reportes</h2>

            <GenerateReport
                date={date}
                setDate={setDate}
                reportType={reportType}
                setReportType={setReportType}
                reportPeriod={reportPeriod}
                setReportPeriod={setReportPeriod}
            />

            <Card>
                <CardHeader>
                    <div className="flex justify-between items-center">
                        <CardTitle>
                            {reportType === "energy" && "Reporte de consumo electrico"}
                            {reportType === "temperature" && "Temperature Report"}
                            {reportType === "access" && "Access Control Report"}
                        </CardTitle>
                        <Button variant="outline" size="sm">
                            <Download className="mr-2 h-4 w-4" />
                            Exportar
                        </Button>
                    </div>
                    <CardDescription>
                        {reportPeriod === "daily" && "Reporte diario de " + (date ? format(date, "PPP", { locale: es }) : "today")}
                        {reportPeriod === "weekly" &&
                            "Weekly report for the week of " + (date ? format(date, "PPP") : "this week")}
                        {reportPeriod === "monthly" &&
                            "Monthly report for " + (date ? format(date, "MMMM yyyy") : "this month")}
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-8">
                        <div className="h-[300px]">
                            {reportType === "energy" && <EnergyConsumptionChart />}
                            {reportType === "temperature" && <AreaConsumptionChart />}
                            {reportType === "access" && (
                                <div className="flex items-center justify-center h-full text-muted-foreground">
                                    Access report visualization
                                </div>
                            )}
                        </div>

                        <div className="border rounded-lg p-4">
                            <h3 className="font-medium mb-2">Resumen</h3>
                            <ul className="space-y-1 text-sm">
                                <li>Total consumo: 142.8 kWh</li>
                                <li>Peak usage time: 14:00 (140 kWh)</li>
                                <li>Lowest usage time: 04:00 (20 kWh)</li>
                                <li>Average temperature: 22.5°C</li>
                                <li>Total entries: 5</li>
                                <li>Total exits: 5</li>
                            </ul>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}

