import { WebhookClient } from "discord.js";

import { lastReconnectingTime } from "./websocket";

import { parseLog } from "@/utils/parseLog";
import { date } from "@/utils/regex";

const config = await import("config.json");

const webhook = new WebhookClient({ url: config.discord_webhook });

export async function consoleLogHandler(log: string) {
    const parsedLog = parseLog(log);

    if (!parsedLog) {
        return;
    }

    const timestamp = log.match(date).pop();

    const messageDate = new Date().setHours(
        parseInt(timestamp.at(0)),
        parseInt(timestamp.at(1)),
        parseInt(timestamp.at(2))
    );

    if (messageDate < lastReconnectingTime) {
        return;
    }

    let avatarURL = "https://mc-heads.net/avatar/MHF_Steve",
        username = "[Server]";

    if (parsedLog.type === "chatMessage") {
        avatarURL = `https://mc-heads.net/avatar/${parsedLog.player}`;
        username = parsedLog.player;
    }

    const emojis = {
        joinEvent: "🟢",
        leaveEvent: "🔴",
        death: "💀",
        achievement: "🏆",
        chatMessage: "",
    };

    await webhook.send({ content: `${emojis[parsedLog.type]} ${parsedLog.content}`, username, avatarURL });
}
