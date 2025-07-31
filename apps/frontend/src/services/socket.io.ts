/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect } from "react";
import { io } from "socket.io-client";

// const socketUrl = 'http://localhost:3000'
const socketUrl = 'https://c8q2gmjq-3000.use2.devtunnels.ms/'

export const socket = io(socketUrl, {
    transports: ['websocket']
});

export const useSocket = (channel: string, callback: (data: any) => void) => {
    useEffect(() => {
        socket.on(channel, callback);

        return () => {
            socket.off(channel, callback);
        };
    }, [channel, callback]);

    return socket;
};
