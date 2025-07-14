import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, } from "@/components/ui/dialog";

import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog"
import { DeviceBody, IDevice, TypeDevice } from "@/services/device/device.interface";
import { DialogFormProps } from "@/components/form/form.interface";
import { Button } from "@/components/ui/button";
import { useForm } from 'react-hook-form';
import { useEffect } from "react";

export const DevicesForm = ({ open, setOpen, onSubmit, data }: DialogFormProps<IDevice, DeviceBody>) => {
    const isEdit = data ? true : false;

    const { register, handleSubmit, watch, setValue, reset } = useForm<DeviceBody>({
        defaultValues: {
            name: '',
            powerWatts: 0,
            type: ''
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

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>{isEdit ? "Editar" : "Agregar Nuevo"} Dispositivo</DialogTitle>
                    <DialogDescription>
                        {isEdit ? "Actualiza la información del dispositivo." : "Crea un nuevo dispositivo."}
                    </DialogDescription>
                </DialogHeader>
                <form id="device-form" onSubmit={handleSubmit(onSubmit)} className="grid gap-4 py-4">
                    <div className="grid gap-2">
                        <Label htmlFor="name">Nombre</Label>
                        <Input
                            id="name"
                            {...register('name')}
                            placeholder="Nombre del dispositivo"
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="type">Tipo</Label>
                        <Select
                            value={watch('type')}
                            onValueChange={(value) => setValue('type', value as TypeDevice)}
                        >
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Selecciona tipo de dispositivo" />
                            </SelectTrigger>
                            <SelectContent>
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
                        <Label htmlFor="consumption">Consumo (W/h)</Label>
                        <Input
                            id="consumption"
                            type="number"
                            placeholder="0"
                            {...register('powerWatts', { valueAsNumber: true })}
                        />
                    </div>
                </form>
                <DialogFooter>
                    <Button variant="outline" onClick={onClose}>
                        Cancel
                    </Button>
                    <Button form="device-form" className="bg-green-600 hover:bg-green-700">
                        {isEdit ? "Actualizar" : "Crear"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export const DeviceAlertDialog = ({ open, setOpen, onSubmit, data }: DialogFormProps<IDevice, IDevice>) => {

    const onClose = () => {
        setOpen(false);
    }

    const onDelete = () => {
        onSubmit(data as IDevice)
        onClose();
    }

    return (
        <AlertDialog onOpenChange={setOpen} open={open}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Estas seguro?</AlertDialogTitle>
                    <AlertDialogDescription>
                        Esta acción no se puede deshacer. Esto eliminara el dispositivo "{data ? data.name : ''}". permanentemente.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel onClick={onClose}>Cancelar</AlertDialogCancel>
                    <AlertDialogAction onClick={onDelete}>Eliminar</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}
