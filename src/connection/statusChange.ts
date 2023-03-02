import chalk from "chalk";

import { serverStatus, events } from "@/index";

import { ws } from "@/utils/logger";

import { Status } from "@/types/Status";

import type { Client } from "discord.js";
import type WebSocket from "ws";

type Message = {
    status: number;
    playerlist?: string[];
    countdown?: number;
};

export const openConsoleStream = (websocket: WebSocket) => {
    ws(`opening ${chalk.cyan("console stream")}`);

    return websocket.send(JSON.stringify({ stream: "console", type: "start" }));
};

export const closeConsoleStream = (websocket: WebSocket) => {
    ws(`closing ${chalk.cyan("console stream")}`);

    return websocket.send(JSON.stringify({ stream: "console", type: "end" }));
};

export async function statusChange(message: Message, websocket: WebSocket, Client: Client) {
    const status = serverStatus.get("status")?.code;

    if (message.status === Status.Online && status !== Status.Online) {
        openConsoleStream(websocket);
    }

    if (message.status === Status.Offline && ![Status.Offline, undefined].includes(status)) {
        closeConsoleStream(websocket);
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
