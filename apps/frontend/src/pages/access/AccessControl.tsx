import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { LogIn, LogOut } from "lucide-react"
import { useEffect, useState } from "react"
import { getAccessLog } from "@/services/accessControl/access-control.service"
import { IAccessLog } from "@/services/accessControl/access-control.interface"
import { IArea } from "@/services/area/area.interface"
import { Role } from "@/services/user/user.interface"
import { formatDateTime } from "@/lib/formatters"

export function AccessControl() {
    const [accessEvents, setAccessEvents] = useState<IAccessLog[]>([])
    const [areas, setAreas] = useState<IArea[]>([]);
    const [areaSelected, setAreaSelected] = useState<IArea | null>(null);

    useEffect(() => {
        getAccessControlApi();
    }, [])

    const getAccessControlApi = async () => {
        try {
            const response: IAccessLog[] = await getAccessLog();
            setAccessEvents(response);
            const getAreas = response.map(item => item.area);
            const areasParse = getAreas.filter((o, index, arr) => arr.findIndex(item => JSON.stringify(item) === JSON.stringify(o)) === index);
            const addAreas: IArea[] = [{ id: 0, name: 'Todas' }, ...areasParse];
            setAreas(addAreas)
        } catch (err) {
            console.log(err);
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

    const setArea = (areaId: number) => {
        if (areaId == 0) return setAreaSelected(null)
        const findArea: IArea = areas.find(item => item.id == Number(areaId)) as IArea;
        setAreaSelected(findArea);
    }


    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold text-black">Control de Acceso</h2>

            <Tabs defaultValue="0" onValueChange={(value) => setArea(Number(value))}>
                <TabsList className="mb-4">
                    {areas.map((area) => (
                        <TabsTrigger className="cursor-pointer" key={area.id} value={area.id.toString()}>
                            {area.name}
                        </TabsTrigger>
                    ))}
                </TabsList>

                {areas.map((area) => (
                    <TabsContent key={area.id} value={area.id.toString()}>
                        <Card>
                            <CardHeader>
                                <CardTitle>{areaSelected ? `${areaSelected.name} - Control de acceso` : "Control de accesos"}</CardTitle>
                                <CardDescription>
                                    Tiempo real de entradas y salidas {areaSelected ? `en el area ${area.name}` : ""}.
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4 h-80 overflow-y-auto">
                                    {accessEvents
                                        .filter((event) => !areaSelected || event.area.id === area.id)
                                        .map((event) => (
                                            <div key={event.id} className="flex items-center justify-between p-4 border rounded-lg">
                                                <div className="flex items-center space-x-4">
                                                    <Avatar>
                                                        <AvatarFallback>
                                                            {event.user.fullName
                                                                .split(" ")
                                                                .map((n) => n[0])
                                                                .join("")}
                                                        </AvatarFallback>
                                                    </Avatar>
                                                    <div>
                                                        <p className="font-medium">{event.user.fullName}</p>
                                                        <p className="text-sm text-muted-foreground">{getRoleName(event.user.role)}</p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center space-x-4">
                                                    <div className="text-right">
                                                        <p className="text-sm">{event.area.name}</p>
                                                        <p className="text-sm text-muted-foreground">{formatDateTime(event.timestamp)}</p>
                                                    </div>
                                                    <Badge
                                                        variant={event.type === "ENTRY" ? "default" : "secondary"}
                                                        className="flex items-center space-x-1"
                                                    >
                                                        {event.type === "ENTRY" ? (
                                                            <>
                                                                <LogIn className="h-3 w-3" /> <span>Entrada</span>
                                                            </>
                                                        ) : (
                                                            <>
                                                                <LogOut className="h-3 w-3" /> <span>Salida</span>
                                                            </>
                                                        )}
                                                    </Badge>
                                                </div>
                                            </div>
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

