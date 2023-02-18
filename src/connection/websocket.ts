import { Client, Message } from "discord.js";
import chalk from "chalk";
import ws from "ws";

import { checkInitialServerState } from "@/lib/initialServerState";

import { statusChange, openConsoleStream } from "@/connection/statusChange";
import { consoleLogHandler } from "@/connection/consoleLog";

import { ws as log } from "@/utils/logger";

import { serverStatus } from "@/index";

const config = await import("config.json");

const headers = {
    Host: "aternos.org",
    Cookie: `ATERNOS_SESSION=${config.aternos_session}; ATERNOS_SERVER=${config.aternos_server_id}`,
    "User-Agent": config.user_agent,
};

const getStatus = () => serverStatus.get("status")?.code;

let reconnecting = false;

export let lastReconnectingTime: number;

export let websocket: ws;

export function connectWS(Client: Client) {
    websocket = new ws("wss://aternos.org/hermes/", {
        origin: "https://aternos.org",
        headers,
    });

    websocket.on("open", () => {
        log(`connection ${chalk.cyan("opened")}`);

        lastReconnectingTime = Date.now();

        if (!getStatus()) {
            checkInitialServerState(websocket, Client);
        }

        if (reconnecting) {
            openConsoleStream(websocket);
        }

        reconnecting = false;

        setInterval(() => {
            websocket.pong("❤");
        }, 45000);
    });

    websocket.on("message", async (raw) => {
        const log = JSON.parse(raw.toString());
        const message = log.message ? JSON.parse(log.message) : null;

        if (log.stream === "console" && log.data !== undefined) {
            return consoleLogHandler(log.data);
        }

        if (message?.status !== undefined) {
            return statusChange(message, websocket, Client);
        }
    });

    websocket.on("discordReceive", (message: Message) => {
        const string = `/tellraw @a ["",{"text":"${message.author.username}","bold": "true","color":"${
            message.member.displayHexColor
        }"},{"text":": "},{"text":"${message.content.replace(/"/g, '\\"')}","color":"yellow"}]`;

        return websocket.send(
            JSON.stringify({
                stream: "console",
                type: "command",
                data: `${string}\r`,
            })
        );
    });

    websocket.on("error", (e) => {
        console.error(e);
    });

    websocket.on("close", (info) => {
        log(`status code ${chalk.magentaBright(info)} - ${chalk.cyan("connection closed")}.`);
        log(`trying to ${chalk.cyan("reconnect")}...`);

        reconnecting = true;

        return connectWS(Client);
    });
}
