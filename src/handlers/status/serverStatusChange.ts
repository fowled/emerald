import { Client, TextChannel } from "discord.js";

import { Server } from "@/components/Server";

module.exports = {
    name: "serverStatusChange",

    async execute(Client: Client) {
        const config = await import("config.json");

        const getChannel = (await Client.channels.fetch(config.updates_channel)) as TextChannel;
        const getThread = await getChannel.threads.fetch(config.updates_thread);
        const getMessage = await getThread.messages.fetch(config.updates_message);

        await Server(getMessage);
    },
};
