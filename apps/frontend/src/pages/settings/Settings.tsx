"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

import { Plus, Edit, Trash2, Lightbulb, Thermometer, Zap } from "lucide-react"
import { IoSettingsOutline } from "react-icons/io5"
import { IDevice, TypeDevice } from "@/services/device/device.interface"
import { IArea } from "@/services/area/area.interface"
import { getDevices } from "@/services/device/device.service"
import { getAreas } from "@/services/area/area.service"
import { createdAreaDevices, deletedAreaDevices, getAreaDevices, updatedAreaDevices } from "@/services/area-device/area-device.service"
import { AreaDeviceBody, GroupAreaDevices, IAreaDevice } from "@/services/area-device/area-device.interface"
import { AreaDeviceAlertDialog, SettingForm } from "./SettingForm"


export const Settings = () => {
    const [areaDevices, setAreaDevices] = useState<GroupAreaDevices>({ allAreaDevices: [], areaDevices: [] })
    const [devices, setDevices] = useState<IDevice[]>([])
    const [areas, setAreas] = useState<IArea[]>([])
    const [dialogOpen, setDialogOpen] = useState(false);
    const [alertOpen, setAlertOpen] = useState(false);
    const [areaDeviceSelected, setAreaDeviceSelected] = useState<IAreaDevice | null>(null);

    useEffect(() => {
        getDevicesApi();
        getAreasApi();
        getAreasDevicesApi();
    }, []);

    // const filterDevices = (filter: string) => {
    //     const normalize = (str: string) => str.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim();

    //     setAreaDevices(prev => ({
    //         ...prev,
    //         devices: prev.allDevices.filter(item => normalize(item.name).includes(normalize(filter)))
    //     }))
    // }

    const getDevicesApi = async () => {
        try {
            const response = await getDevices();
            setDevices(response)
        } catch (err) {
            console.log(err);
        }
    }
    const getAreasApi = async () => {
        try {
            const response = await getAreas();
            setAreas(response)
        } catch (err) {
            console.log(err);
        }
    }
    const getAreasDevicesApi = async () => {
        try {
            const response = await getAreaDevices();
            setAreaDevices({ allAreaDevices: response, areaDevices: response })
        } catch (err) {
            console.log(err);
        }
    }

    const actionTable = (action: string, areaDevice: IAreaDevice) => {
        setAreaDeviceSelected(areaDevice)
        if (action == 'edit') {
            setDialogOpen(true)
        }
        if (action == 'delete') {
            setAlertOpen(true)
        }
    }

    const newAreaDevice = () => {
        setAreaDeviceSelected(null);
        setDialogOpen(true);
    }

    const actionForm = async (newDevice: AreaDeviceBody) => {
        if (areaDeviceSelected) {
            await updatedAreaDevices(areaDeviceSelected.id, newDevice)
        } else {
            await createdAreaDevices(newDevice)
        }
        setDialogOpen(false);
        await getAreasDevicesApi();
    }

    const deleteAreaDevice = async (device: IAreaDevice) => {
        if (areaDeviceSelected) {
            await deletedAreaDevices(device.id)
            setAlertOpen(false);
            await getAreasDevicesApi();
        }
    }

    const getDeviceIcon = (type: TypeDevice) => {
        switch (type) {
            case "LIGHT":
                return <Lightbulb className="h-4 w-4 text-yellow-500" />
            case "AC":
                return <Thermometer className="h-4 w-4 text-blue-500" />
            default:
                return <Zap className="h-4 w-4 text-gray-500" />
        }
    }

    const getAreaStats = () => {
        const stats = areas.map((area) => {
            const areaAssignments = areaDevices.allAreaDevices.filter((a) => a.areaId === area.id)
            const totalConsumption = areaAssignments.reduce((sum, a) => sum + a.device.powerWatts, 0)
            return {
                ...area,
                deviceCount: areaAssignments.length,
                totalConsumption,
            }
        }).filter(item => item.deviceCount != 0)
        return stats;
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold">Configuración</h2>
                    <p className="text-muted-foreground">Asigna los dispositivos a las areas</p>
                </div>
                <Button onClick={newAreaDevice} className="bg-green-600 hover:bg-green-700">
                    <Plus className="mr-2 h-4 w-4" />
                    Asignar dispositivo
                </Button>
            </div>

            <div className="overflow-x-auto w-[65rem] py-2">
                <div className="flex items-center gap-4 w-max">
                    {getAreaStats().map((area) => (
                        <Card key={area.id} className="w-48">
                            <CardHeader className="-mb-6">
                                <CardTitle className="text-sm font-medium">{area.name}</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{area.deviceCount}</div>
                                <p className="text-xs text-muted-foreground">Dispositivos</p>
                                <div className="text-sm font-medium text-green-600 mt-1">{area.totalConsumption} W/h</div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center">
                        <IoSettingsOutline className="mr-2 h-5 w-5 text-green-600" />
                        Dispositivos asignados
                    </CardTitle>
                    <CardDescription>Dispositivos actuales por area</CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Nombre</TableHead>
                                <TableHead>Area</TableHead>
                                <TableHead>Dispositivo</TableHead>
                                <TableHead>Tipo</TableHead>
                                <TableHead>Consumo</TableHead>
                                <TableHead className="text-right">Acciones</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {areaDevices.areaDevices.map((assignment) => (
                                <TableRow key={assignment.id}>
                                    <TableCell className="font-medium">{assignment.name}</TableCell>
                                    <TableCell className="font-medium">{assignment.area.name}</TableCell>
                                    <TableCell>
                                        <div className="flex items-center space-x-2">
                                            {getDeviceIcon(assignment.device.type)}
                                            <span>{assignment.device.name}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="capitalize">{assignment.device.type == 'LIGHT' ? 'Luz' : 'Aire Acondicionado'}</TableCell>
                                    <TableCell>{assignment.device.powerWatts} W/h</TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex justify-end space-x-2">
                                            <Button variant="secondary" size="icon" onClick={() => actionTable('edit', assignment)}>
                                                <Edit className="h-4 w-4 text-green-500" />
                                            </Button>
                                            <Button variant="secondary" size="icon" onClick={() => actionTable('delete', assignment)}>
                                                <Trash2 className="h-4 w-4 text-red-500" />
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            {
                dialogOpen && (
                    <SettingForm
                        open={dialogOpen}
                        setOpen={setDialogOpen}
                        data={areaDeviceSelected}
                        onSubmit={actionForm}
                        areas={areas}
                        devices={devices}
                    />
                )
            }

            <AreaDeviceAlertDialog
                open={alertOpen}
                setOpen={setAlertOpen}
                data={areaDeviceSelected}
                onSubmit={deleteAreaDevice}
            />
        </div >
    )
}
