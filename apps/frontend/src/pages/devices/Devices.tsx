
import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Plus, Edit, Trash2, Lightbulb, Thermometer, Zap } from "lucide-react"
import { FaPlug } from "react-icons/fa"
import { DeviceBody, GroupDevices, IDevice, TypeDevice } from "@/services/device/device.interface"
import { createdDevice, deletedDevice, getDevices, updatedDevice } from "@/services/device/device.service"
import { DeviceAlertDialog, DevicesForm } from "./DevicesForm";
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export const Devices = () => {
    const [devices, setDevices] = useState<GroupDevices>({ allDevices: [], devices: [] })
    const [dialogOpen, setDialogOpen] = useState(false);
    const [alertOpen, setAlertOpen] = useState(false);
    const [deviceSelected, setDeviceSelected] = useState<IDevice | null>(null);

    useEffect(() => {
        getDevicesApi();
    }, []);

    const filterDevices = (filter: string) => {
        const normalize = (str: string) => str.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim();

        setDevices(prev => ({
            ...prev,
            devices: prev.allDevices.filter(item => normalize(item.name).includes(normalize(filter)))
        }))
    }

    const selectDevices = (type: TypeDevice) => {
        setDevices(prev => ({
            ...prev,
            devices: type == 'all' ? prev.allDevices : prev.allDevices.filter(item => item.type == type)
        }))
    }

    const getDevicesApi = async () => {
        try {
            const response = await getDevices();
            setDevices({ allDevices: response, devices: response })
        } catch (err) {
            console.log(err);
        }
    }
    const actionTable = (action: string, device: IDevice) => {
        setDeviceSelected(device)
        if (action == 'edit') {
            setDialogOpen(true)
        }
        if (action == 'delete') {
            setAlertOpen(true)
        }
    }

    const newDevice = () => {
        setDeviceSelected(null);
        setDialogOpen(true);
    }

    const actionForm = async (newDevice: DeviceBody) => {
        if (deviceSelected) {
            await updatedDevice(deviceSelected.id, newDevice)
        } else {
            await createdDevice(newDevice)
        }
        setDialogOpen(false);
        await getDevicesApi();
    }

    const deleteDevice = async (device: IDevice) => {
        if (deviceSelected) {
            await deletedDevice(device.id)
            setAlertOpen(false);
            await getDevicesApi();
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

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold">Control de dispositivos</h2>
                    <p className="text-muted-foreground">Administra todos los dispositivos de tu institución educativa. </p>
                </div>

                <Button onClick={newDevice} className="bg-green-600 hover:bg-green-700">
                    <Plus className="mr-2 h-4 w-4" />
                    Agregar Dispositivo
                </Button>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Dispositivos</CardTitle>
                        <Zap className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{devices.allDevices.length}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Dispositivos Activos</CardTitle>
                        <Zap className="h-4 w-4 text-green-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{devices.allDevices.length}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Consumo total</CardTitle>
                        <Zap className="h-4 w-4 text-yellow-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {devices.allDevices.reduce((sum, d) => sum + d.powerWatts, 0)} W/h
                        </div>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <FaPlug className="mr-2 h-5 w-5 text-green-600" />
                            <p>Dispositivos</p>
                        </div>

                        <div className="flex gap-2">
                            <div className="grid gap-2">
                                <Label>Tipo</Label>
                                <Select defaultValue="all" onValueChange={selectDevices}>
                                    <SelectTrigger className="w-40">
                                        <SelectValue placeholder="Selecciona tipo de dispositivo" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">
                                            Todos
                                        </SelectItem>
                                        <SelectItem value="LIGHT">
                                            Luz
                                        </SelectItem>
                                        <SelectItem value="AC">
                                            Aire Acondicionado
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="grid gap-2">
                                <Label>Buscar dispositivo</Label>
                                <Input type="search" className="w-72" placeholder="Buscar dispositivo..." onChange={(e) => filterDevices(e.target.value)} />
                            </div>
                        </div>
                    </CardTitle>


                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Dispositivo</TableHead>
                                <TableHead>Tipo</TableHead>
                                <TableHead>Consumo</TableHead>
                                <TableHead className="text-right">Acciones</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {devices.devices.map((device) => (
                                <TableRow key={device.id}>
                                    <TableCell className="font-medium">
                                        <div className="flex items-center space-x-2">
                                            {getDeviceIcon(device.type)}
                                            <span>{device.name}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="capitalize">{device.type == 'AC' ? 'Aire Acondicionado' : 'Luz'}</TableCell>
                                    <TableCell>{device.powerWatts} W/h</TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex justify-end space-x-2">
                                            <Button variant="secondary" size="icon" onClick={() => actionTable('edit', device)}>
                                                <Edit className="h-4 w-4 text-green-500" />
                                            </Button>
                                            <Button variant="secondary" size="icon" onClick={() => actionTable('delete', device)}>
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

            {dialogOpen && (
                <DevicesForm
                    open={dialogOpen}
                    setOpen={setDialogOpen}
                    data={deviceSelected}
                    onSubmit={actionForm}
                />
            )}

            <DeviceAlertDialog
                open={alertOpen}
                setOpen={setAlertOpen}
                data={deviceSelected}
                onSubmit={deleteDevice}
            />
        </div>
    )
}
