import { Client, Message, TextChannel } from "discord.js";

import { Server } from "@/components/Server";

import { getConfig } from "@/utils/config";

module.exports = {
    name: "serverStatusChange",

    async execute(Client: Client) {
        const config = await getConfig();

        if (!config.updates_message) {
            return;
        }

        const getChannel = (await Client.channels.fetch(config.updates_channel)) as TextChannel;

        let getMessage: Message;

        if (config.updates_thread) {
            const getThread = await getChannel.threads.fetch(config.updates_thread);

            getMessage = await getThread.messages.fetch(config.updates_message);
        } else {
            getMessage = await getChannel.messages.fetch(config.updates_message);
        }

        await Server(getMessage);
    },
};
