import { DialogFormProps } from '@/components/form/form.interface'
import { AreaDeviceBody, IAreaDevice } from '@/services/area-device/area-device.interface'
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, } from "@/components/ui/dialog"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, } from "@/components/ui/alert-dialog"
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useForm } from 'react-hook-form';
import { useEffect } from "react";
import { Input } from '@/components/ui/input'
import { IArea } from '@/services/area/area.interface'
import { IDevice, TypeDevice } from '@/services/device/device.interface'
import { Lightbulb, Thermometer, Zap } from 'lucide-react'


interface SettingFormProps extends DialogFormProps<IAreaDevice, AreaDeviceBody> {
    areas: IArea[]
    devices: IDevice[]
}

export const SettingForm = ({ open, setOpen, onSubmit, data, areas, devices }: SettingFormProps) => {
    const isEdit = data ? true : false;

    const { register, handleSubmit, watch, setValue, reset } = useForm<AreaDeviceBody>({
        defaultValues: {
            name: '',
            deviceId: 0,
            areaId: 0
        }
    });

    useEffect(() => {
        if (data) {
            reset(data)
        }
    }, [data])

    const onClose = () => {
        setOpen(false);
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
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>{isEdit ? "Editar asignación" : "Asignar un dispositivo a un area"}</DialogTitle>
                    <DialogDescription>
                        {isEdit ? "Actualiza la asignación del dispositivo" : "Asigna un dispositivo a un area especifica."}
                    </DialogDescription>
                </DialogHeader>
                <form id='area-device-form' onSubmit={handleSubmit(onSubmit)} className="grid gap-4 py-4">
                    <div className="grid gap-2">
                        <Label htmlFor="name">Nombre</Label>
                        <Input
                            id="name"
                            type="text"
                            placeholder="Nombre..."
                            {...register('name')}
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="area">Area</Label>
                        <Select value={watch('areaId').toString()} onValueChange={(value) => setValue('areaId', Number(value))}>
                            <SelectTrigger className='w-full'>
                                <SelectValue placeholder="Selecciona un area" />
                            </SelectTrigger>
                            <SelectContent>
                                {areas.map((area) => (
                                    <SelectItem key={area.id} value={area.id.toString()}>
                                        {area.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="grid gap-2 w-full">
                        <Label htmlFor="device">Dispositivo</Label>
                        <Select
                            value={watch('deviceId').toString()}
                            onValueChange={(value) => setValue('deviceId', Number(value))}
                        >
                            <SelectTrigger className='w-full'>
                                <SelectValue placeholder="Selecciona un dispositivo" />
                            </SelectTrigger>
                            <SelectContent className='w-full'>
                                {devices.map((device) => (
                                    <SelectItem key={device.id} value={device.id.toString()}>
                                        <div className="flex items-center justify-between space-x-2 w-80">
                                            <div className="flex items-center gap-2">
                                                {getDeviceIcon(device.type)}
                                                <span>{device.name}</span>
                                            </div>
                                            <Badge variant="outline" className="ml-auto">
                                                {device.powerWatts}W
                                            </Badge>
                                        </div>
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </form>
                <DialogFooter>
                    <Button variant="outline" onClick={onClose}>
                        Cancel
                    </Button>
                    <Button form='area-device-form' type='submit' className="bg-green-600 hover:bg-green-700">
                        {isEdit ? "Actualizar" : "Asignar"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}


export const AreaDeviceAlertDialog = ({ open, setOpen, onSubmit, data }: DialogFormProps<IAreaDevice, IAreaDevice>) => {
    const onClose = () => {
        setOpen(false);
    }

    const onDelete = () => {
        onSubmit(data as IAreaDevice)
        onClose();
    }
    return (
        <AlertDialog open={open} onOpenChange={setOpen}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Estas seguro?</AlertDialogTitle>
                    <AlertDialogDescription>
                        Esta acción no se puede deshacer. Esto eliminara el dispositivo "{data ? data.device.name : ''}" del area "
                        {data?.area.name}".
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                    <AlertDialogAction onClick={onDelete}>Remover</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}