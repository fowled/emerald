import { Client, WebhookClient } from "discord.js";

import { lastReconnectingTime } from "./websocket";

const config = await import("config.json");

export async function consoleLogHandler(log: string, Client: Client) {
    if (!log.toLowerCase().includes("server thread/info")) {
        return;
    }

    const dateRegex = /\[(.*?)\]/;
    const authorRegex = /\<(.*?)\>/;

    const date = log?.match(dateRegex)?.at(1)?.split(":")?.slice(0, 3);

    const messageDate = new Date().setHours(parseInt(date.at(0)), parseInt(date.at(1)), parseInt(date.at(2)));

    const author = log.match(authorRegex)?.at(1);

    if (messageDate < lastReconnectingTime || (!author && !/joined the game|left the game/.test(log))) {
        return;
    }

    const msgContentRegex = new RegExp(`${dateRegex.source}|:|${authorRegex.source}`, "g");

    let occurences = 0;

    const finalLog = log.replace(msgContentRegex, (match) => (++occurences <= 4 ? "" : match)).trim();

    const avatar = author ? `https://mc-heads.net/avatar/${author}` : "https://mc-heads.net/avatar/MHF_Steve";

    const fetchWebhook = new WebhookClient({ url: config.discord_webhook });

    await fetchWebhook.edit({ name: author ?? "Server", avatar });

    await fetchWebhook.send(finalLog);
}
