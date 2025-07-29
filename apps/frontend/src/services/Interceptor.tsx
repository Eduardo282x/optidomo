import { useEffect } from 'react';
import { api } from './api';
import { toast } from 'sonner';

export const useAxiosInterceptor = () => {
    // const navigate = useNavigate();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const isValidMessage = (msg: any) => {
        return typeof msg === 'string' && msg.trim().length > 2;
    };

    useEffect(() => {
        const interceptor = api.interceptors.response.use(
            (response) => {
                if (['post', 'put', 'delete'].includes(response.config.method || '')) {
                    const message = response.data;
                    if (isValidMessage(message.message)) {
                        if (message.success) {
                            toast.success(message.message, {
                                position: 'top-right',
                            });
                        } else {
                            toast.error(message.message, {
                                position: 'top-right'
                            });
                        }
                    }
                }
                return response;
            },
            (error) => {
                if (['post', 'put', 'delete'].includes(error.config?.method || '')) {
                    const message = error.response?.data;
                    const parseMessage = message.message.length > 0 ? message.message[0] : message.message
                    toast.error(parseMessage, {
                        position: 'top-right'
                    });
                }
                return Promise.reject(error);
            }
        );

        // Limpia el interceptor al desmontar
        return () => {
            api.interceptors.response.eject(interceptor);
        };
    }, []);

    return null;
}
