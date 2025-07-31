import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button"
import { Lightbulb, Power } from "lucide-react"
import { IArea } from "@/services/area/area.interface"
import { IAreaDevice } from "@/services/area-device/area-device.interface"
import { getAreaDevices, toggleAllStatusDevices, toggleStatusDevice, toggleStatusDevicesByArea } from "@/services/area-device/area-device.service"
import { socket, useSocket } from "@/services/socket.io"


export const LightingControl = () => {
    // const [lights, setLights] = useState<LightFixture[]>(lightData)
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
            setAreaDevices(response);
            const areas = response.map(item => item.area);
            const uniqueAreas = areas.filter((a, i, arr) =>
                arr.findIndex(b => b.id === a.id) === i
            );
            setAreas([{ id: 0, name: 'Todas' }, ...uniqueAreas]);
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

    const toggleAllLights = async (areaId: string, status: boolean) => {
        if (areaId == '0') return await turnOffAllLights(status)
        setAreaDevices(prev => {
            const updated = prev.map(item => ({
                ...item,
                isOn: item.areaId == Number(areaId) ? status : item.isOn
            }))
            socket.emit('areaDevicesUpdate', updated)
            return updated;
        })
        await toggleStatusDevicesByArea(Number(areaId), 'LIGHT', status)
    }

    const turnOffAllLights = async (status: boolean) => {
        setAreaDevices(prev => {
            const updated = prev.map(item => ({
                ...item,
                isOn: status
            }))
            socket.emit('areaDevicesUpdate', updated);
            return updated;
        })
        await toggleAllStatusDevices('LIGHT', status);
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-black">Control de Luces</h2>
                <Button variant="outline" onClick={() => turnOffAllLights(false)}>
                    <Power className="mr-2 h-4 w-4" /> Apagar todas
                </Button>
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
                                    <CardTitle>{areaSelected ? `${areaSelected.name} - Luces` : "Control de Luces"}</CardTitle>
                                    <div className="flex space-x-4">
                                        <Button variant="outline" size="sm" onClick={() => toggleAllLights(area.id.toString(), true)}>
                                            Prender todas
                                        </Button>
                                        <Button variant="outline" size="sm" onClick={() => toggleAllLights(area.id.toString(), false)}>
                                            Apagar todas
                                        </Button>
                                    </div>
                                </div>
                                <CardDescription>Control de luces en {area.name.toLowerCase()}.</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="grid gap-4 md:grid-cols-2">
                                    {areaDevices
                                        .filter(item => item.device.type == 'LIGHT')
                                        .filter((event) => !areaSelected || event.area.id === area.id)
                                        .map((light) => (
                                            <Card
                                                key={light.id}
                                                className={`border-l-4 ${light.device.name ? "border-l-yellow-400" : "border-l-gray-300"}`}
                                            >
                                                <CardContent className="p-4">
                                                    <div className="flex justify-between items-center">
                                                        <div className="flex items-center space-x-4">
                                                            <div
                                                                className={`p-2 rounded-full ${light.isOn ? "bg-yellow-100 text-yellow-600" : "bg-gray-100 text-gray-400"}`}
                                                            >
                                                                <Lightbulb className="h-5 w-5" />
                                                            </div>
                                                            <div>
                                                                <p className="font-medium">{light.name} - {light.device.name}</p>
                                                                <p className="text-sm text-muted-foreground">
                                                                    {light.device.type} • {light.device.powerWatts} W/h
                                                                </p>
                                                            </div>
                                                        </div>
                                                        <Switch checked={light.isOn} onCheckedChange={() => changeStatus(light.id)} />
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

