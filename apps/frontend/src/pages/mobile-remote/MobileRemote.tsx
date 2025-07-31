import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { ArrowLeft, Building, Lightbulb, Thermometer, Zap, Power, Smartphone } from "lucide-react"
import { IAreaDevice } from "@/services/area-device/area-device.interface"
import { IArea } from "@/services/area/area.interface"
import { socket, useSocket } from "@/services/socket.io"
import { getAreaDevices, toggleAllStatusDevices, toggleStatusDevice, toggleStatusDevicesByArea } from "@/services/area-device/area-device.service"
import { TypeDevice } from "@/services/device/device.interface"

export const MobileRemote = () => {
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
            setAreas(uniqueAreas);
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

    const toggleAllDevices = async (areaId: string, status: boolean) => {
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

    const getDeviceIcon = (type: TypeDevice, status: boolean) => {
        const baseClasses = "h-6 w-6"
        const colorClasses = status ? "text-green-500" : "text-gray-400"

        switch (type) {
            case "LIGHT":
                return <Lightbulb className={`${baseClasses} ${status ? "text-yellow-500" : "text-gray-400"}`} />
            case "AC":
                return <Thermometer className={`${baseClasses} ${status ? "text-blue-500" : "text-gray-400"}`} />
            default:
                return <Zap className={`${baseClasses} ${colorClasses}`} />
        }
    }

    return (
        <div className="min-h-screen bg-gray-200 p-4">

            {areaSelected == null
                ? (
                    <div className="max-w-md mx-auto space-y-6">
                        {/* Header */}
                        <div className="text-center space-y-2">
                            <div className="flex justify-center">
                                <div className="flex items-center justify-center w-12 h-12 bg-green-600 rounded-full shadow-lg">
                                    <Smartphone className="w-6 h-6 text-white" />
                                </div>
                            </div>
                            <h1 className="text-2xl font-bold text-gray-900">Control Remoto</h1>
                        </div>

                        {/* Areas Grid */}
                        <div className="space-y-3">
                            <h2 className="text-lg font-semibold text-gray-900">Selecciona un Area</h2>
                            {areas.map((area) => (
                                <Card
                                    key={area.id}
                                    className="bg-white/80 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-200 cursor-pointer active:scale-95"
                                    onClick={() => setArea(area.id)}
                                >
                                    <CardContent className="p-4">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center space-x-3">
                                                <div className="flex items-center justify-center w-10 h-10 bg-green-100 rounded-full">
                                                    <Building className="w-5 h-5 text-green-600" />
                                                </div>
                                                <div>
                                                    <h3 className="font-medium text-gray-900">{area.name}</h3>
                                                    <p className="text-sm text-gray-600">{areaDevices.filter(ar => ar.areaId == area.id).length} devices</p>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <div className="flex items-center space-x-2">
                                                    <Badge
                                                        variant='default'
                                                        className="bg-green-100 text-green-700"
                                                    >
                                                        {areaDevices.filter(ar => ar.areaId == area.id).filter(dev => dev.isOn).length} active
                                                    </Badge>
                                                </div>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </div>
                )
                : (
                    <div className="min-h-screen bg-gray-200 p-4">
                        <div className="max-w-md mx-auto space-y-4">
                            {/* Header */}
                            <div className="flex items-center justify-between">
                                <Button variant="ghost" onClick={() => setArea(0)} className="p-2">
                                    <ArrowLeft className="h-5 w-5" />
                                </Button>
                                <div className="text-center">
                                    <h1 className="text-lg font-bold text-gray-900">{areaSelected.name}</h1>
                                </div>
                                <div className="w-10" /> {/* Spacer */}
                            </div>

                            {/* Area Controls */}
                            <Card className="bg-white/80 backdrop-blur-sm shadow-lg">
                                <CardContent className="px-4">
                                    <div className="flex flex-wrap justify-between gap-2">
                                        <Button
                                            onClick={() => toggleAllDevices(areaSelected.id.toString(), true)}
                                            className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                                        >
                                            <Power className="mr-2 h-4 w-4" />
                                            Prender todos
                                        </Button>
                                        <Button
                                            onClick={() => toggleAllDevices(areaSelected.id.toString(), false)}
                                            variant="outline"
                                            className="flex-1"
                                        >
                                            <Power className="mr-2 h-4 w-4" />
                                            Apagar todos
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Devices List */}
                            <div className="space-y-3">
                                {areaDevices.filter(area => area.areaId == areaSelected.id).map((device) => (
                                    <Card
                                        key={device.id}
                                        className={`bg-white/80 backdrop-blur-sm shadow-lg transition-all duration-200 ${device.isOn ? "ring-2 ring-green-200" : ""
                                            }`}
                                    >
                                        <CardContent className="p-4">
                                            <div className="flex items-center justify-between" onClick={() => changeStatus(device.id)}>
                                                <div className="flex items-center space-x-3">
                                                    {getDeviceIcon(device.device.type, device.isOn)}
                                                    <div>
                                                        <h3 className="font-medium text-gray-900">{device.name}</h3>
                                                        <div className="flex items-center space-x-2 mt-1">
                                                            <Badge variant="outline" className="text-xs">
                                                                {device.device.type}
                                                            </Badge>
                                                            <span className="text-xs text-gray-500">{device.device.powerWatts}W</span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="flex items-center space-x-3">
                                                    <Badge variant={device.isOn ? "active" : "secondary"} className="text-xs rounded-full">
                                                        {device.isOn ? "ON" : "OFF"}
                                                    </Badge>
                                                    <Switch checked={device.isOn} onCheckedChange={() => changeStatus(device.id)} />
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        </div>
                    </div>
                )
            }
        </div>
    )
}
