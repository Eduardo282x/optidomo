import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, } from "@/components/ui/dialog";

import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog"
import { DialogFormProps } from "@/components/form/form.interface";
import { Button } from "@/components/ui/button";
import { useForm } from 'react-hook-form';
import { useEffect } from "react";
import { AreaBody, IArea } from "@/services/area/area.interface";

export const AreaForm = ({ open, setOpen, onSubmit, data }: DialogFormProps<IArea, AreaBody>) => {
    const isEdit = data ? true : false;

    const { register, handleSubmit, reset } = useForm<AreaBody>({
        defaultValues: {
            name: '',
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
                    <DialogTitle>{isEdit ? "Editar" : "Agregar"} Area</DialogTitle>
                    <DialogDescription>
                        {isEdit ? "Actualiza el nombre del area" : "Crea una nueva area."}
                    </DialogDescription>
                </DialogHeader>
                <form id="device-form" onSubmit={handleSubmit(onSubmit)} className="grid gap-4 py-4">
                    <div className="grid gap-2">
                        <Label htmlFor="name">Nombre</Label>
                        <Input
                            id="name"
                            {...register('name')}
                            placeholder="Nombre del area"
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

export const AreaAlertDialog = ({ open, setOpen, onSubmit, data }: DialogFormProps<IArea, IArea>) => {

    const onClose = () => {
        setOpen(false);
    }

    const onDelete = () => {
        onSubmit(data as IArea)
        onClose();
    }

    return (
        <AlertDialog onOpenChange={setOpen} open={open}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Estas seguro?</AlertDialogTitle>
                    <AlertDialogDescription>
                        Esta acción no se puede deshacer. Esto eliminara el area "{data ? data.name : ''}". permanentemente.
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
