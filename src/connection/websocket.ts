import { Client, Message } from "discord.js";
import chalk from "chalk";
import ws from "ws";

import { checkInitialServerState } from "@/lib/initialServerState";

import { consoleLogHandler } from "@/connection/consoleLog";
import { statusChange } from "@/connection/statusChange";

import { ws as log } from "@/utils/logger";

import { serverStatus } from "@/index";

const config = await import("config.json");

const headers = {
    Host: "aternos.org",
    Cookie: `ATERNOS_SESSION=${config.aternos_session}; ATERNOS_SERVER=${config.aternos_server_id}`,
    "User-Agent": config.user_agent,
};

const getStatus = () => serverStatus.get("status")?.code;

export let websocket: ws;

export function connectWS(Client: Client) {
    websocket = new ws("wss://aternos.org/hermes/", {
        origin: "https://aternos.org",
        headers,
    });

    websocket.on("open", () => {
        log("connection opened");

        if (!getStatus()) {
            checkInitialServerState(websocket, Client);
        }

        setInterval(() => {
            websocket.pong("❤");
        }, 45000);
    });

    websocket.on("message", async (raw) => {
        const log = JSON.parse(raw.toString());
        const message = log.message ? JSON.parse(log.message) : null;

        if (log.stream === "console" && log.data !== undefined) {
            return consoleLogHandler(log.data, Client);
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
        log(`status code ${chalk.magentaBright(info)} - connection closed.`);
        log("trying to reconnect...");

        return connectWS(Client);
    });
}
