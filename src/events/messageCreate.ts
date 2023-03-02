import { Client, Message } from "discord.js";

import { websocket } from "@/connection/websocket";

import { getConfig } from "@/utils/config";

import { serverStatus } from "@/index";

import { Status } from "@/types/Status";

module.exports = {
    name: "messageCreate",

    async execute(_: Client, message: Message) {
        const config = await getConfig();

        const status = serverStatus.get("status").code;

        const conditions = [
            !config.chat_channel,
            message.author.bot,
            message.content.startsWith("//"),
            message.channel.id !== config.chat_channel,
            status !== Status.Online,
        ];

        if (!conditions.every((el) => el === true)) {
            return;
        }

        return websocket.emit("discordReceive", message);
    },
};
