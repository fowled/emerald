import { Client, Message } from "discord.js";

import { websocket } from "@/connection/websocket";

import { serverStatus } from "@/index";

import { StatusEnum } from "@/types/Status";

module.exports = {
    name: "messageCreate",

    async execute(_: Client, message: Message) {
        if (message.author.bot || message.content.startsWith("//")) {
            return;
        }

        const config = await import("config.json");

        const status = serverStatus.get("status").code;

        if (message.channel.id !== config.chat_channel || status !== StatusEnum.Online) {
            return;
        }

        return websocket.emit("discordReceive", message);
    },
};
