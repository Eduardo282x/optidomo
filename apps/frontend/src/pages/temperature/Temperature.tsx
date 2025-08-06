import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button"
import { Thermometer } from "lucide-react"
import { IAreaDevice } from "@/services/area-device/area-device.interface"
import { getAreaDevices, toggleAllStatusDevices, toggleStatusDevice, toggleStatusDevicesByArea } from "@/services/area-device/area-device.service"
import { IArea } from "@/services/area/area.interface"
import { socket, useSocket } from "@/services/socket.io"

export const TemperatureControl = () => {
    const [areas, setAreas] = useState<IArea[]>([]);
    const [areaSelected, setAreaSelected] = useState<IArea | null>(null);
    const [areaDevices, setAreaDevices] = useState<IAreaDevice[]>([]);

    useEffect(() => {
        getAreaDeviceApi();
    }, []);

    useSocket('areaDevicesUpdate', (data: IAreaDevice[]) => {
        if (data && data.length > 0) {
            setAreaDevices(data)
        }
    })

    const getAreaDeviceApi = async () => {
        try {
            const response: IAreaDevice[] = await getAreaDevices();
            setAreaDevices(response.map(item => ({ ...item, temperature: 23 })));
            const areas = response.map(item => item.area);
            const uniqueAreas = areas.filter((a, i, arr) =>
                arr.findIndex(b => b.id === a.id) === i
            );
            setAreas([{ id: 0, name: 'Todas las areas' }, ...uniqueAreas]);
        } catch (err) {
            console.log(err);
        }
    };

    const setArea = (areaId: number) => {
        if (areaId == 0) return setAreaSelected(null)
        const findArea: IArea = areas.find(item => item.id == Number(areaId)) as IArea;
        setAreaSelected(findArea);
    }

    const changeStatus = async (id: number) => {
        await toggleStatusDevice(id);
        setAreaDevices(prev => {
            const updated = prev.map(item => ({
                ...item,
                isOn: item.id == id ? !item.isOn : item.isOn
            }))
            socket.emit('areaDevicesUpdate', updated)
            return updated;
        })
    }

    const changeTemperature = (deviceId: number, temperature: number) => {
        setAreaDevices(prev => prev.map(item => ({
            ...item,
            temperature: item.id == deviceId ? temperature : item.temperature
        })))
    }

    const toggleAllAirCondition = async (areaId: string, status: boolean) => {
        if (areaId == '0') return await turnOffAllAirCondition(status)
        setAreaDevices(prev => {
            const updated = prev.map(item => ({
                ...item,
                isOn: item.areaId == Number(areaId) ? status : item.isOn
            }))
            socket.emit('areaDevicesUpdate', updated)
            return updated;
        })
        await toggleStatusDevicesByArea(Number(areaId), 'AC', status)
    }

    const turnOffAllAirCondition = async (status: boolean) => {
        setAreaDevices(prev => {
            const updated = prev.map(item => ({
                ...item,
                isOn: status
            }))
            socket.emit('areaDevicesUpdate', updated);
            return updated;
        })
        await toggleAllStatusDevices('AC', status);
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-black">Control de Temperatura</h2>
                {/* <Button variant="outline" onClick={() => turnOffAllAirCondition(false)}>
                    <Power className="mr-2 h-4 w-4" /> Apagar todos
                </Button> */}
            </div>

            <Tabs defaultValue="0" onValueChange={(value) => setArea(Number(value))}>
                <TabsList className="flex items-center gap-2 mb-4">
                    {areas.map((area) => (
                        <TabsTrigger key={area.id} value={area.id.toString()}>
                            {area.name}
                        </TabsTrigger>
                    ))}
                </TabsList>

                {areas.map((area) => (
                    <TabsContent key={area.id} value={area.id.toString()}>
                        <Card>
                            <CardHeader>
                                <div className="flex justify-between items-center">
                                    <CardTitle>{areaSelected ? `${areaSelected.name} - Control de temperatura` : "Control de temperatura"}</CardTitle>
                                    <div className="flex space-x-4">
                                        <Button variant="outline" size="sm" onClick={() => toggleAllAirCondition(area.id.toString(), true)}>
                                            Prender todas
                                        </Button>
                                        <Button variant="outline" size="sm" onClick={() => toggleAllAirCondition(area.id.toString(), false)}>
                                            Apagar todas
                                        </Button>
                                    </div>
                                </div>
                                <CardDescription>Ajuste de temperatura para {area.name.toLowerCase()}.</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="grid gap-4 md:grid-cols-2">
                                    {areaDevices
                                        .filter(item => item.device.type == 'AC')
                                        .filter((event) => !areaSelected || event.area.id === area.id)
                                        .map((ac) => (
                                            <Card
                                                key={ac.id}
                                                className={`border-l-4 ${ac.device.name ? "border-l-blue-400" : "border-l-gray-300"}`}
                                            >
                                                <CardContent className="p-6">
                                                    <div className="flex flex-col space-y-4">
                                                        <div className="flex justify-between items-center">
                                                            <div className="flex items-center space-x-4">
                                                                <div
                                                                    className={`p-2 rounded-full ${ac.isOn ? "bg-blue-100 text-blue-600" : "bg-gray-100 text-gray-400"}`}
                                                                >
                                                                    <Thermometer className="h-5 w-5" />
                                                                </div>
                                                                <div>
                                                                    <p className="font-medium">{ac.name}</p>
                                                                    <p className="text-sm text-muted-foreground">
                                                                        Consumo actual: {ac.device.powerWatts} W/h
                                                                    </p>
                                                                </div>
                                                            </div>
                                                            <Switch checked={ac.isOn} onCheckedChange={() => changeStatus(ac.id)} />
                                                        </div>

                                                        <div className="pt-4">
                                                            <div className="flex justify-between items-center mb-2">
                                                                <span className="text-sm font-medium">Temperatura</span>
                                                                <span className="text-2xl font-bold text-blue-500">{ac.temperature}°C</span>
                                                            </div>
                                                            <Slider
                                                                disabled={!ac.isOn}
                                                                value={[Number(ac.temperature)]}
                                                                min={18}
                                                                max={28}
                                                                step={1}
                                                                onValueChange={(value) => changeTemperature(ac.id, value[0])}
                                                                className={ac.isOn ? "" : "opacity-50"}
                                                            />
                                                            <div className="flex justify-between text-xs text-muted-foreground mt-1">
                                                                <span>18°C</span>
                                                                <span>23°C</span>
                                                                <span>28°C</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        ))}
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>
                ))}
            </Tabs>
        </div>
    )
}

