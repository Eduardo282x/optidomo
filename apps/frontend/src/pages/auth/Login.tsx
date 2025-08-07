import { ScreenLoader } from "@/components/loaders/ScreenLoader"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { loginAPI } from "@/services/auth/auth.service"
import { IUser } from "@/services/user/user.interface"
import { Leaf, Mail, EyeOff, Eye, Loader2, Lock, Smartphone } from "lucide-react"
import { useState } from "react"
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router"

export interface ILogin {
    email: string;
    password: string;
}

export const Login = () => {
    const navigate = useNavigate();
    const { register, handleSubmit } = useForm<ILogin>({
        defaultValues: {
            email: '',
            password: ''
        }
    });
    const [showPassword, setShowPassword] = useState(false)
    const [isLoading, setIsLoading] = useState(false)

    const onSubmit = async (data: ILogin) => {
        setIsLoading(true)
        try {
            const response = await loginAPI(data);
            if (response && response.success) {
                const user: IUser = response.data
                localStorage.setItem('token', JSON.stringify(user))
                setTimeout(() => {
                    if(user.role =='TEACHER'){
                        navigate('/acceso')
                    }else {
                        navigate('/')
                    }
                }, 1500);
            }
        } catch (err) {
            console.log(err);
        }
        setIsLoading(false)
    }

    const goToControlRemote = () => navigate('/control-remoto')

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-200 p-4">
            {isLoading && <ScreenLoader/>}
            <div className="w-full max-w-md space-y-6">
                {/* Logo and Title */}
                <div className="text-center space-y-4">
                    <div className="flex justify-center">
                        <div className="flex items-center justify-center w-16 h-16 bg-green-600 rounded-full shadow-lg">
                            <Leaf className="w-8 h-8 text-white" />
                        </div>
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">OPTIDOMO</h1>
                        {/* <p className="text-gray-600">Energy Monitoring System</p> */}
                    </div>
                </div>
                <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
                    <CardHeader className="space-y-1 text-center">
                        <CardTitle className="text-2xl font-semibold">Bienvenido</CardTitle>
                        <CardDescription>Inicia sesión para acceder al sistemas</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="email">Correo electrónico</Label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder="Ingresa tu Correo electrónico"
                                        {...register('email')}
                                        className="pl-10"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="password">Contraseña</Label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                    <Input
                                        id="password"
                                        type={showPassword ? "text" : "password"}
                                        placeholder="Ingresa tu Contraseña"
                                        className="pl-10 pr-10"
                                        {...register('password')}
                                    />
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="sm"
                                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                                        onClick={() => setShowPassword(!showPassword)}
                                    >
                                        {showPassword ? (
                                            <EyeOff className="h-4 w-4 text-gray-400" />
                                        ) : (
                                            <Eye className="h-4 w-4 text-gray-400" />
                                        )}
                                    </Button>
                                </div>
                            </div>

                            <Button type="submit" className="w-full bg-green-600 hover:bg-green-700 text-white" disabled={isLoading}>
                                {isLoading ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Cargando...
                                    </>
                                ) : (
                                    "Ingresar"
                                )}
                            </Button>
                        </form>
                    </CardContent>
                </Card>

                <Button onClick={goToControlRemote} variant='default' className="w-full text-xl">
                    <Smartphone className="text-white" />
                    Control Remoto
                </Button>

            </div>
        </div>
    )
}
