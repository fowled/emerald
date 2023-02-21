import { WebhookClient } from "discord.js";

import { lastReconnectingTime } from "./websocket";

import { enclosedUsername, colors } from "@/utils/regex";
import { parseLog } from "@/utils/parseLog";

const config = await import("config.json");

const webhook = new WebhookClient({ url: config.discord_webhook });

export async function consoleLogHandler(log: string) {
    const parsedLog = parseLog(log.replace(colors, ""));

    if (!parsedLog) {
        return;
    }

    const timestamp = log
        .match(/(?:[0-1][0-9]|2[0-3]):?[0-5][0-9]:?[0-5][0-9]?/g)
        .shift()
        .split(":")
        .map(Number);

    const messageDate = new Date().setHours(...(timestamp as [number, number, number]));

    if (messageDate < lastReconnectingTime) {
        return;
    }

    const emojis = { join: "🟢", leave: "🔴", death: "💀", achievement: "🏆" };

    let username = "[Server]",
        avatarURL = "https://mc-heads.net/avatar/MHF_Steve";

    if (parsedLog.type === "message") {
        const player = log.match(enclosedUsername).shift().replace(/[<>]/g, "");

        avatarURL = `https://mc-heads.net/avatar/${player}`;
        username = player;
    }

    await webhook.send({ content: `${emojis[parsedLog.type] ?? ""} ${parsedLog.content}`.trim(), username, avatarURL });
}
