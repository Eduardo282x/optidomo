import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { CalendarIcon, FileBarChart } from "lucide-react"
import { format } from "date-fns"
import { FC } from "react"
import { es } from "date-fns/locale"

interface GenerateReportProps {
    reportType: 'LIGHT' | 'AC' | 'ACCESS';
    setReportType: (reportType: 'LIGHT' | 'AC' | 'ACCESS') => void;
    date: Date | undefined;
    setDate: (date: Date | undefined) => void;
    onReset: () => void
    onSubmit: () => void
}

export const GenerateReport: FC<GenerateReportProps> = ({ reportType, setReportType, date, setDate, onReset, onSubmit }) => {
    return (
        <div>
            <Card>
                <CardHeader>
                    <CardTitle>Generar Reporte</CardTitle>
                    <CardDescription>Crear un reporte personalizado del consumo de energía y temperatura.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid gap-6 md:grid-cols-3">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Tipo de reporte</label>
                            <Select value={reportType} onValueChange={setReportType}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select report type" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="LIGHT">Consumo Energético</SelectItem>
                                    <SelectItem value="AC">Temperatura</SelectItem>
                                    <SelectItem value="ACCESS">Control de Acceso</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium">Rango de fecha</label>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button
                                        variant={"outline"}
                                        className={cn("w-full justify-start text-left font-normal", !date && "text-muted-foreground")}
                                    >
                                        <CalendarIcon className="mr-2 h-4 w-4" />
                                        {date ? format(date, "PPP", { locale: es }) : <span>Selecciona un dia</span>}
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0">
                                    <Calendar mode="single"
                                        locale={es}
                                        selected={date}
                                        onSelect={setDate}
                                        initialFocus />
                                </PopoverContent>
                            </Popover>
                        </div>
                    </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                    <Button onClick={onReset} variant="outline">Reiniciar</Button>
                    <Button onClick={onSubmit} className="bg-green-600 hover:bg-green-500">
                        <FileBarChart className="mr-2 h-4 w-4" />
                        Generar Reporte
                    </Button>
                </CardFooter>
            </Card>
        </div>
    )
}
