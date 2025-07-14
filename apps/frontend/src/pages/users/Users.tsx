import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Plus, Edit, Trash2, Shield, GraduationCap } from "lucide-react"
import { FaUserFriends } from "react-icons/fa"
import { GroupUser, IUser, Role, UserBody } from "@/services/user/user.interface"
import { createUser, deleteUser, getUsers, updateUser } from "@/services/user/user.service"
import { UserAlertDialog, UsersForm } from "./UsersForm"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { formatDate } from "@/lib/formatters"


export const Users = () => {
    const [users, setUsers] = useState<GroupUser>({ allUsers: [], users: [] })

    const [dialogOpen, setDialogOpen] = useState(false);
    const [alertOpen, setAlertOpen] = useState(false);
    const [userSelected, setUserSelected] = useState<IUser | null>(null);

    useEffect(() => {
        getUsersApi();
    }, []);

    const filterUser = (filter: string) => {
        const normalize = (str: string) => str.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim();

        setUsers(prev => ({
            ...prev,
            users: prev.allUsers.filter(item => 
                normalize(item.fullName).includes(normalize(filter)) ||
                normalize(item.email).includes(normalize(filter))
            )
        }))
    }

    const getUsersApi = async () => {
        try {
            const response = await getUsers();
            setUsers({ allUsers: response, users: response })
        } catch (err) {
            console.log(err);
        }
    }

    const actionTable = (action: string, device: IUser) => {
        setUserSelected(device)
        if (action == 'edit') {
            setDialogOpen(true)
        }
        if (action == 'delete') {
            setAlertOpen(true)
        }
    }

    const newUser = () => {
        setUserSelected(null);
        setDialogOpen(true);
    }

    const actionForm = async (newUser: UserBody) => {
        if (userSelected) {
            await updateUser(userSelected.id, newUser)
        } else {
            await createUser(newUser)
        }
        setDialogOpen(false);
        await getUsersApi();
    }

    const deleteUserApi = async (user: IUser) => {
        if (userSelected) {
            await deleteUser(user.id)
            setAlertOpen(false);
            await getUsersApi();
        }
    }

    const getRoleIcon = (role: Role) => {
        switch (role) {
            case "ADMIN":
                return <Shield className="h-4 w-4 text-red-500" />
            case "TEACHER":
                return <GraduationCap className="h-4 w-4 text-blue-500" />
            default:
                return <FaUserFriends className="h-4 w-4 text-gray-500" />
        }
    }

    const getRoleBadgeColor = (role: Role) => {
        switch (role) {
            case "ADMIN":
                return "destructive"
            case "TEACHER":
                return "default"
            default:
                return "secondary"
        }
    }

    const getRoleName = (role: Role) => {
        switch (role) {
            case "ADMIN":
                return "Administrador"
            case "TEACHER":
                return "Profesor"
            default:
                return "Estudiante"
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold">Usuarios</h2>
                    <p className="text-muted-foreground">Administra los usuarios </p>
                </div>
                <Button onClick={newUser} className="bg-green-600 hover:bg-green-700">
                    <Plus className="mr-2 h-4 w-4" />
                    Agregar usuario
                </Button>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 -mb-5">
                        <CardTitle className="text-sm font-medium">Total Usuarios</CardTitle>
                        <FaUserFriends className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{users.allUsers.length}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 -mb-5">
                        <CardTitle className="text-sm font-medium">Usuarios Activos</CardTitle>
                        <FaUserFriends className="h-4 w-4 text-green-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{users.allUsers.length}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 -mb-5">
                        <CardTitle className="text-sm font-medium">Administradores</CardTitle>
                        <Shield className="h-4 w-4 text-red-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{users.allUsers.filter((u) => u.role === "ADMIN").length}</div>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                        <div className="flex items-center">
                            <FaUserFriends className="mr-2 h-5 w-5 text-green-600" />
                            <p>Usuarios</p>
                        </div>

                        <div className="grid gap-2">
                            <Label>Buscar usuario</Label>
                            <Input type="search" className="w-72" placeholder="Buscar usuario..." onChange={(e) => filterUser(e.target.value)} />
                        </div>
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Usuario</TableHead>
                                <TableHead>Email</TableHead>
                                <TableHead>Rol</TableHead>
                                <TableHead>Creado</TableHead>
                                <TableHead className="text-right">Acciones</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {users.users.map((user) => (
                                <TableRow key={user.id}>
                                    <TableCell className="font-medium">
                                        <div className="flex items-center space-x-3">
                                            <Avatar>
                                                <AvatarFallback>
                                                    {user.fullName
                                                        .split(" ")
                                                        .map((n) => n[0])
                                                        .join("")}
                                                </AvatarFallback>
                                            </Avatar>
                                            <span>{user.fullName}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell>{user.email}</TableCell>
                                    <TableCell>
                                        <div className="flex items-center space-x-2">
                                            {getRoleIcon(user.role)}
                                            <Badge variant={getRoleBadgeColor(user.role)} className="capitalize">
                                                {getRoleName(user.role)}
                                            </Badge>
                                        </div>
                                    </TableCell>
                                    <TableCell>{formatDate(user.createdAt)}</TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex justify-end space-x-2">
                                            <Button variant="secondary" size="icon" onClick={() => actionTable('edit', user)}>
                                                <Edit className="h-4 w-4 text-green-500" />
                                            </Button>
                                            <Button variant="secondary" size="icon" onClick={() => actionTable('delete', user)}>
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
                <UsersForm
                    open={dialogOpen}
                    setOpen={setDialogOpen}
                    data={userSelected}
                    onSubmit={actionForm}
                />
            )}

            <UserAlertDialog
                open={alertOpen}
                setOpen={setAlertOpen}
                data={userSelected}
                onSubmit={deleteUserApi}
            />
        </div>
    )
}
