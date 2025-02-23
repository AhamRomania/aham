import { getAccessToken } from "./Auth";
import getDomain, { Domain } from "./domain";

let ws: WebSocket | null = null;
let connecting = false;
const handlers: Record<string, ((data: any) => void)[]> = {};
let reconnectAttempts = 0;
const MAX_RECONNECT_ATTEMPTS = 5; // Set the max reconnection attempts.
const RECONNECT_DELAY = 1000; // Delay in milliseconds (1 second).

const connectWebSocket = async () => {
    
    if (typeof(window) === 'undefined') {
        return;
    }

    if (ws || connecting) return;
    
    connecting = true;
    try {
        const token = await getAccessToken();
        ws = new WebSocket(getDomain(Domain.Api, `/v1/ws?access_token=${token}`));
        
        ws.addEventListener("open", () => {
            console.info("ws: connected");
            connecting = false;
            reconnectAttempts = 0; // Reset the reconnect attempts on a successful connection
        });

        ws.addEventListener("message", (socketEvent) => {
            try {
                const { event, data } = JSON.parse(socketEvent.data);
                if (event == "touch") {
                    ws!.send(JSON.stringify({ event, data }));
                    return
                }
                handlers[event]?.forEach((fn) => fn(data));
            } catch (error) {
                console.error("ws: error parsing message", error);
            }
        });

        ws.addEventListener("close", () => {
            console.info("ws: closed");
            ws = null;
            connecting = false;
            handleReconnect(); // Attempt to reconnect when closed
        });

        ws.addEventListener("error", (event) => {
            console.error("ws: error", event);
            connecting = false;
            handleReconnect(); // Attempt to reconnect on error
        });
    } catch (error) {
        console.error("ws: failed to connect", error);
        connecting = false;
        handleReconnect(); // Attempt to reconnect on failure
    }
};

// Function to handle reconnections with exponential backoff
const handleReconnect = () => {
    if (reconnectAttempts < MAX_RECONNECT_ATTEMPTS) {
        const delay = Math.min(RECONNECT_DELAY * Math.pow(2, reconnectAttempts), 30000); // Exponential backoff with a max delay of 30 seconds
        reconnectAttempts++;
        console.info(`ws: attempting reconnect in ${delay}ms...`);
        setTimeout(connectWebSocket, delay);
    } else {
        console.error("ws: max reconnect attempts reached. Giving up.");
    }
};

const useSocket = () => {
    connectWebSocket();

    return {
        on: <T>(name: string, fn: (data: T) => void): (() => void) => {
            if (!handlers[name]) {
                handlers[name] = [];
            }
            handlers[name].push(fn);

            return () => {
                handlers[name] = handlers[name].filter((handler) => handler !== fn);
                if (handlers[name].length === 0) {
                    delete handlers[name];
                }
            };
        },
        write: async (name: string, data: any) => {
            await connectWebSocket();
            if (!ws || ws.readyState !== WebSocket.OPEN) {
                console.error("ws: not connected");
                return;
            }
            ws.send(JSON.stringify({ event: name, ...data }));
        }
    };
};

export default useSocket;
