import { WebhookClient } from "discord.js";

import { lastReconnectingTime } from "./websocket";

import { enclosedUsername, colors } from "@/utils/regex";
import { parseLog } from "@/utils/parseLog";
import { getConfig } from "@/utils/config";

const { discord_webhook, chat_channel } = await getConfig();

const webhook = discord_webhook ? new WebhookClient({ url: discord_webhook }) : null;

export async function consoleLogHandler(log: string) {
    const parsedLog = parseLog(log.replace(colors, ""));

    if (!chat_channel || !discord_webhook || !parsedLog) {
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
