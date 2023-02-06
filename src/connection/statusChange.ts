import { serverStatus, events } from "@/index";

import { StatusEnum } from "@/types/Status";

import type { Client } from "discord.js";
import type WebSocket from "ws";

type Message = {
    status: number;
    playerlist?: string[];
    countdown?: number;
};

export async function statusChange(message: Message, websocket: WebSocket, Client: Client) {
    const getCurrentStatus = serverStatus.get("status")?.code;

    if (message.status === StatusEnum.Online && getCurrentStatus !== StatusEnum.Online) {
        websocket.send(JSON.stringify({ stream: "console", type: "start" }));
    }

    if (message.status === StatusEnum.Offline && getCurrentStatus !== StatusEnum.Offline) {
        websocket.send(JSON.stringify({ stream: "console", type: "end" }));
    }

    const eventData = {
        code: message.status,
    };

    if (message.playerlist) {
        eventData["players"] = message.playerlist;
    }

    if (message.countdown) {
        eventData["countdown"] = message.countdown;
    }

    serverStatus.set("status", eventData);

    return events.emit("serverStatusChange", Client);
}
