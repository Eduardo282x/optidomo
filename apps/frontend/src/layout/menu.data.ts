import { Lightbulb, Thermometer, Lock, FileBarChart } from 'lucide-react';
import { FaUserFriends, FaHome, FaPlug } from 'react-icons/fa';
import { MdOutlineMeetingRoom } from 'react-icons/md';
import { IoSettingsOutline } from 'react-icons/io5';
import { Role } from '@/services/user/user.interface';


export interface IMenu {
    label: string;
    icon: React.ComponentType<{ className?: string }>
    url: string;
    className?: string;
    permission: Role[];
    active: boolean;
    type: 'normal' | 'separador'
}

export const menu: IMenu[] = [
    {
        label: 'Inicio',
        icon: FaHome,
        url: '/',
        permission: ['ADMIN'],
        active: false,
        type: 'normal',
        className: 'green-600',
    },
    {
        label: 'Luces',
        icon: Lightbulb,
        url: '/luces',
        permission: ['ADMIN', 'TEACHER'],
        active: false,
        type: 'normal',
        className: 'yellow-500',
    },
    {
        label: 'Temperatura',
        icon: Thermometer,
        url: '/temperatura',
        permission: ['ADMIN', 'TEACHER'],
        active: false,
        type: 'normal',
        className: 'orange-500',
    },
    {
        label: 'Acceso',
        icon: Lock,
        url: '/acceso',
        permission: ['ADMIN', 'TEACHER'],
        active: false,
        type: 'normal',
        className: 'sky-500',
    },
    {
        label: 'Separador',
        icon: Lock,
        url: 'separador',
        permission: ['ADMIN'],
        active: false,
        type: 'separador',
        className: 'sky-500',
    },
    {
        label: 'Estudiantes',
        icon: FaUserFriends,
        url: '/estudiantes',
        permission: ['ADMIN'],
        active: false,
        type: 'normal',
        className: 'sky-500',
    },
    {
        label: 'Usuarios',
        icon: FaUserFriends,
        url: '/usuarios',
        permission: ['ADMIN'],
        active: false,
        type: 'normal',
        className: 'purple-500',
    },
    {
        label: 'Separador',
        icon: Lock,
        url: 'separador',
        permission: ['ADMIN'],
        active: false,
        type: 'separador',
        className: 'sky-500',
    },

    {
        label: 'Áreas',
        icon: MdOutlineMeetingRoom,
        url: '/areas',
        permission: ['ADMIN'],
        active: false,
        type: 'normal',
        className: 'emerald-500',
    },
    {
        label: 'Dispositivos',
        icon: FaPlug,
        url: '/dispositivos',
        permission: ['ADMIN'],
        active: false,
        type: 'normal',
        className: 'indigo-500',
    },
    {
        label: 'Reportes',
        icon: FileBarChart,
        url: '/reportes',
        permission: ['ADMIN'],
        active: false,
        type: 'normal',
        className: 'fuchsia-600',
    },
    {
        label: 'Configuración',
        icon: IoSettingsOutline,
        url: '/configuracion',
        permission: ['ADMIN'],
        active: false,
        type: 'normal',
        className: 'gray-500',
    },
];