import { Leaf, LogOut } from "lucide-react"
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { IMenu, menu } from "./menu.data"
import { useEffect, useState } from "react"
import { useLocation, useNavigate } from 'react-router';
import { Separator } from "@/components/ui/separator"

export const AppSidebar = () => {
    const location = useLocation();
    const navigate = useNavigate();
    // const [bgColor, setBgColor] = useState<string>('');
    const [menuSidebar, setMenuSidebar] = useState<IMenu[]>(menu);

    useEffect(() => {
        setMenuSidebar((prev) => (
            prev.map(me => {
                return {
                    ...me,
                    active: me.url === location.pathname
                }
            })
        ))

        // if (location.pathname === '/') setBgColor('bg-green-400')
        // if (location.pathname === '/luces') setBgColor('bg-yellow-300')
        // if (location.pathname === '/temperatura') setBgColor('bg-orange-300')
        // if (location.pathname === '/acceso') setBgColor('bg-blue-300')
        // if (location.pathname === '/reportes') setBgColor('bg-purple-300')
    }, [location.pathname]);

    const logout = () => {
        navigate('/login')
    }

    const colorClassMap: Record<string, { text: string; bg: string }> = {
        'green-600': { text: 'text-green-600', bg: 'bg-green-600' },
        'yellow-500': { text: 'text-yellow-500', bg: 'bg-yellow-500' },
        'orange-500': { text: 'text-orange-500', bg: 'bg-orange-500' },
        'sky-500': { text: 'text-sky-500', bg: 'bg-sky-500' },
        'emerald-500': { text: 'text-emerald-500', bg: 'bg-emerald-500' },
        'indigo-500': { text: 'text-indigo-500', bg: 'bg-indigo-500' },
        'gray-500': { text: 'text-gray-500', bg: 'bg-gray-500' },
        'purple-500': { text: 'text-purple-500', bg: 'bg-purple-500' },
        'fuchsia-600': { text: 'text-fuchsia-600', bg: 'bg-fuchsia-600' },
    };

    return (
        <Sidebar>
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg">
                            <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-green-600 text-white">
                                <Leaf className="size-4" />
                            </div>
                            <div className="flex flex-col gap-0.5 leading-none">
                                <span className="font-semibold">OPTIDOMO</span>
                                {/* <span className="text-xs text-muted-foreground">Monitoreo de Energía</span> */}
                            </div>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>
            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {menuSidebar && menuSidebar.map((me: IMenu, index: number) => {
                                // const color = colorClassMap[me.className ?? 'gray-500'];
                                const color = colorClassMap[me.className ?? 'gray-500'] || colorClassMap['gray-500'];
                                return (
                                    me.type == 'normal' ?
                                        <SidebarMenuItem key={index}>
                                            <SidebarMenuButton
                                                onClick={() => navigate(me.url)}
                                                className={`font-medium cursor-pointer text-md hover:${color.text} ${me.active
                                                    ? `${color.bg} hover:text-white hover:${color.bg} text-white`
                                                    : `${color.text}`}`}>
                                                <me.icon />
                                                <span>{me.label}</span>
                                            </SidebarMenuButton>
                                        </SidebarMenuItem>
                                        :
                                        <Separator />
                                )
                            })}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>

            <SidebarFooter>
                <div className="flex items-center justify-between p-4">
                    <Button variant="outline" onClick={logout} className="w-full bg-red-600 text-white">
                        <span>Cerrar Sesión</span>
                        <LogOut className="h-4 w-4" />
                    </Button>
                </div>
            </SidebarFooter>
        </Sidebar>
    )
}

