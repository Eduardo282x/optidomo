import { ScreenLoader } from '@/components/loaders/ScreenLoader'
import { SidebarProvider } from '@/components/ui/sidebar'
import { AppSidebar } from '@/layout/AppSidebar'
import { useApiLoading } from '@/services/Interceptor'
import { useEffect } from 'react'
// import { useEffect, useState } from 'react';
import { Outlet, useLocation } from 'react-router'
import { useNavigate } from 'react-router'

export const Layout = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { isLoading } = useApiLoading();

    useEffect(() => {console.log(isLoading);
    },[isLoading])

    useEffect(() => {
        const getToken = localStorage.getItem('token');
        if (!getToken) {
            navigate('/login')
        }
    }, [location.pathname])

    return (
        <div className='w-full h-full'>
            <SidebarProvider>
                <AppSidebar></AppSidebar>
                <div className={`w-full h-full min-h-screen p-4 bg-gray-200`}>
                    {isLoading && <ScreenLoader />}
                    <Outlet></Outlet>
                </div>
            </SidebarProvider>
        </div>
    )
}
