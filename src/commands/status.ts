import { ChatInputCommandInteraction, Client } from "discord.js";

import { Server } from "@/components/Server";

import { i18n } from "@/utils/i18n";

const { description } = i18n("status");

module.exports = {
    name: "status",
    description,
    category: "misc",

    async execute(_: Client, interaction: ChatInputCommandInteraction) {
        return await Server(interaction);
    },
};
