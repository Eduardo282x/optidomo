import { Lightbulb, Thermometer, Lock, FileBarChart } from 'lucide-react';
import { FaUserFriends, FaHome, FaPlug } from 'react-icons/fa';
import { MdOutlineMeetingRoom } from 'react-icons/md';
import { IoSettingsOutline } from 'react-icons/io5';


export interface IMenu {
    label: string;
    icon: React.ComponentType<{ className?: string }>
    url: string;
    className?: string;
    active: boolean;
    type: 'normal' | 'separador'
}

export const menu: IMenu[] = [
    {
        label: 'Inicio',
        icon: FaHome,
        url: '/',
        active: false,
        type: 'normal',
        className: 'green-600',
    },
    {
        label: 'Luces',
        icon: Lightbulb,
        url: '/luces',
        active: false,
        type: 'normal',
        className: 'yellow-500',
    },
    {
        label: 'Temperatura',
        icon: Thermometer,
        url: '/temperatura',
        active: false,
        type: 'normal',
        className: 'orange-500',
    },
    {
        label: 'Acceso',
        icon: Lock,
        url: '/acceso',
        active: false,
        type: 'normal',
        className: 'sky-500',
    },
    {
        label: 'Acceso',
        icon: Lock,
        url: '/acceso',
        active: false,
        type: 'separador',
        className: 'sky-500',
    },
    {
        label: 'Áreas',
        icon: MdOutlineMeetingRoom,
        url: '/areas',
        active: false,
        type: 'normal',
        className: 'emerald-500',
    },
    {
        label: 'Dispositivos',
        icon: FaPlug,
        url: '/dispositivos',
        active: false,
        type: 'normal',
        className: 'indigo-500',
    },
    {
        label: 'Usuarios',
        icon: FaUserFriends,
        url: '/usuarios',
        active: false,
        type: 'normal',
        className: 'purple-500',
    },
    {
        label: 'Reportes',
        icon: FileBarChart,
        url: '/reportes',
        active: false,
        type: 'normal',
        className: 'fuchsia-600',
    },
        {
        label: 'Configuración',
        icon: IoSettingsOutline,
        url: '/configuracion',
        active: false,
        type: 'normal',
        className: 'gray-500',
    },
];