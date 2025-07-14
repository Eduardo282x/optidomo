import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Plus, Edit, Trash2, Building } from "lucide-react"
import { AreaBody, GroupAreas, IArea } from "@/services/area/area.interface"
import { createdArea, deletedArea, getAreas, updatedArea } from "@/services/area/area.service"
import { AreaAlertDialog, AreaForm } from "./AreaForm"


export const Areas = () => {
    const [areas, setAreas] = useState<GroupAreas>({ allAreas: [], areas: [] })
    const [dialogOpen, setDialogOpen] = useState(false);
    const [alertOpen, setAlertOpen] = useState(false);
    const [areaSelected, setAreaSelected] = useState<IArea | null>(null);

    useEffect(() => {
        getAreasApi();
    }, []);

    const filterAreas = (filter: string) => {
        const normalize = (str: string) => str.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim();

        setAreas(prev => ({
            ...prev,
            areas: prev.allAreas.filter(item => normalize(item.name).includes(normalize(filter)))
        }))
    }

    const getAreasApi = async () => {
        try {
            const response = await getAreas();
            setAreas({ allAreas: response, areas: response })
        } catch (err) {
            console.log(err);
        }
    }
    const actionTable = (action: string, area: IArea) => {
        setAreaSelected(area)
        if (action == 'edit') {
            setDialogOpen(true)
        }
        if (action == 'delete') {
            setAlertOpen(true)
        }
    }

    const newArea = () => {
        setAreaSelected(null);
        setDialogOpen(true);
    }

    const actionForm = async (newArea: AreaBody) => {
        if (areaSelected) {
            await updatedArea(areaSelected.id, newArea)
        } else {
            await createdArea(newArea)
        }
        setDialogOpen(false);
        await getAreasApi();
    }

    const deleteArea = async (Area: IArea) => {
        if (areaSelected) {
            await deletedArea(Area.id)
            setAlertOpen(false);
            await getAreasApi();
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold">Control de Areas</h2>
                    <p className="text-muted-foreground">Maneja todas las areas en tu institución educativa.</p>
                </div>
                <Button onClick={newArea} className="bg-green-600 hover:bg-green-700">
                    <Plus className="mr-2 h-4 w-4" />
                    Agregar Area
                </Button>
            </div>

            <Card>
                <CardHeader className="flex items-center justify-between">
                    <div>
                        <CardTitle className="flex items-center">
                            <Building className="mr-2 h-5 w-5 text-green-600" />
                            Areas
                        </CardTitle>
                        <CardDescription><span className="font-semibold">Total areas:</span> {areas.allAreas.length}</CardDescription>
                    </div>

                    <div className="grid gap-2">
                        <Label>Buscar dispositivo</Label>
                        <Input type="search" className="w-72" placeholder="Buscar dispositivo..." onChange={(e) => filterAreas(e.target.value)} />
                    </div>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Area</TableHead>
                                <TableHead className="text-right">Acciones</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {areas.areas.map((area) => (
                                <TableRow key={area.id}>
                                    <TableCell className="font-medium">{area.name}</TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex justify-end space-x-2">
                                            <Button variant="secondary" size="icon" onClick={() => actionTable('edit', area)}>
                                                <Edit className="h-4 w-4 text-green-500" />
                                            </Button>
                                            <Button variant="secondary" size="icon" onClick={() => actionTable('delete', area)}>
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
                <AreaForm
                    open={dialogOpen}
                    setOpen={setDialogOpen}
                    data={areaSelected}
                    onSubmit={actionForm}
                />
            )}

            <AreaAlertDialog
                open={alertOpen}
                setOpen={setAlertOpen}
                data={areaSelected}
                onSubmit={deleteArea}
            />
        </div>
    )
}
