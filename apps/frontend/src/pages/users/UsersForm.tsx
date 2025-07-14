import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog"

import { DialogFormProps } from "@/components/form/form.interface";
import { IUser, Role, UserBody } from "@/services/user/user.interface";
import { useForm } from 'react-hook-form';
import { useEffect } from "react";
import { Button } from "@/components/ui/button";

export const UsersForm = ({ open, setOpen, onSubmit, data }: DialogFormProps<IUser, UserBody>) => {
    const isEdit = data ? true : false;

    const { register, handleSubmit, watch, setValue, reset } = useForm<UserBody>({
        defaultValues: {
            fullName: '',
            email: '',
            role: ''
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
                    <DialogTitle>{isEdit ? "Actualizar Usuario" : "Agregar nuevo Usuario"}</DialogTitle>
                    <DialogDescription>
                        {isEdit ? "Actualiza la información del usuario." : "Crea una nueva cuenta de usuario para el sistema."}
                    </DialogDescription>
                </DialogHeader>
                <form id="user-form" onSubmit={handleSubmit(onSubmit)} className="grid gap-4 py-4">
                    <div className="grid gap-2">
                        <Label htmlFor="name">Nombre completo</Label>
                        <Input
                            id="name"
                            placeholder="Nombre completo"
                            {...register('fullName')}
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="email">Correo electrónico</Label>
                        <Input
                            id="email"
                            type="email"
                            placeholder="Correo electrónico"
                            {...register('email')}
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="role">Rol</Label>
                        <Select value={watch('role')} onValueChange={(value) => setValue('role', value as Role)}>
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Selecciona un rol" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="ADMIN">Administrator</SelectItem>
                                <SelectItem value="TEACHER">Profesor</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </form>
                <DialogFooter>
                    <Button type="button" variant="outline" onClick={onClose}>
                        Cancelar
                    </Button>
                    <Button form="user-form" type="submit" className="bg-green-600 hover:bg-green-700">
                        {isEdit ? "Actualizar" : "Crear"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export const UserAlertDialog = ({ open, setOpen, onSubmit, data }: DialogFormProps<IUser, IUser>) => {

    const onClose = () => {
        setOpen(false);
    }

    const onDelete = () => {
        onSubmit(data as IUser)
        onClose();
    }

    return (
        <AlertDialog onOpenChange={setOpen} open={open}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Estas seguro?</AlertDialogTitle>
                    <AlertDialogDescription>
                        Esta acción no se puede deshacer. Esto eliminara al usuario "{data ? data.fullName : ''}". permanentemente.
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