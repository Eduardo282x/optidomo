import { BrowserRouter, Routes, Route } from 'react-router';
import { Layout } from './layout/Layout';
import { DashboardView } from './pages/dashboard/Dashboard';
import { LightingControl } from './pages/lighting/Lighting';
import { TemperatureControl } from './pages/temperature/Temperature';
import { AccessControl } from './pages/access/AccessControl';
import { ReportsModule } from './pages/report/Report';
import { Users } from './pages/users/Users';
import { Settings } from './pages/settings/Settings';
import { Devices } from './pages/devices/Devices';
import { Areas } from './pages/areas/Areas';
import { Login } from './pages/auth/Login';
import { Toaster } from './components/ui/sonner';
import { useAxiosInterceptor } from './services/Interceptor';
import { MobileRemote } from './pages/mobile-remote/MobileRemote';

export const App = () => {
  useAxiosInterceptor();

  return (
    <div className='w-screen h-screen overflow-y-auto'>
      <Toaster richColors />
      <BrowserRouter>
        <Routes>
          <Route element={<Login />} path='/login'></Route>
          <Route element={<MobileRemote />} path='/control-remoto'></Route>

          <Route element={<Layout></Layout>}>
            <Route element={<DashboardView />} path='/'></Route>
            <Route element={<LightingControl />} path='/luces'></Route>
            <Route element={<TemperatureControl />} path='/temperatura'></Route>
            <Route element={<AccessControl />} path='/acceso'></Route>
            <Route element={<Areas />} path='/areas'></Route>
            <Route element={<Devices />} path='/dispositivos'></Route>
            <Route element={<Settings />} path='/configuracion'></Route>
            <Route element={<Users />} path='/estudiantes'></Route>
            <Route element={<Users />} path='/usuarios'></Route>
            <Route element={<ReportsModule />} path='/reportes'></Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  )
}
