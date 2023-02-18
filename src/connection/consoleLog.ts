import { createLoggedMessage, createLoggedEvent } from "minecraft-server-logs";
import { WebhookClient } from "discord.js";

import { lastReconnectingTime } from "./websocket";

const config = await import("config.json");

const webhook = new WebhookClient({ url: config.discord_webhook });

export async function consoleLogHandler(log: string) {
    const parseLog = createLoggedMessage(log);
    const parseEventLog = createLoggedEvent(parseLog);

    if (!parseEventLog) {
        return;
    }

    const timestamp = parseEventLog.timestamp.split(":");

    const messageDate = new Date().setHours(
        parseInt(timestamp.at(0)),
        parseInt(timestamp.at(1)),
        parseInt(timestamp.at(2))
    );

    if (messageDate < lastReconnectingTime) {
        return;
    }

    let avatarURL = "https://mc-heads.net/avatar/MHF_Steve",
        content: string,
        username = "[Serveur]";

    switch (parseEventLog.eventName) {
        case "chatMessage":
            avatarURL = `https://mc-heads.net/avatar/${parseEventLog["playerName"]}`;
            username = parseEventLog["playerName"];
            content = parseEventLog["messageContent"];
            break;

        case "playerJoined":
            content = `🟢 ${parseEventLog["playerName"]} a rejoint le serveur.`;
            break;

        case "playerLeft":
            content = `🔴 ${parseEventLog["playerName"]} a quitté le serveur.`;
            break;
    }

    await webhook.send({ content, username, avatarURL });
}
