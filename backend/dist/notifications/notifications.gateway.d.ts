import { Server } from 'socket.io';
export declare class NotificationsGateway {
    server: Server;
    handlePing(client: any, payload: any): string;
}
