import { Client, ColorResolvable, EmbedBuilder, TextChannel } from "discord.js";

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

    const head = `https://mc-heads.net/avatar/${author}/`;

    let embedColor: ColorResolvable;

    if (!author && finalLog.includes("joined the game")) {
        embedColor = "Green";
    } else if (!author && finalLog.includes("left the game")) {
        embedColor = "Red";
    } else {
        embedColor = "Blue";
    }

    const embed = new EmbedBuilder()
        .setAuthor({ name: author ?? "Server", iconURL: head })
        .setDescription(finalLog)
        .setColor(embedColor);

    ((await Client.channels.fetch(config.chat_channel)) as TextChannel).send({ embeds: [embed] });
}
