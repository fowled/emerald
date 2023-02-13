import { ChatInputCommandInteraction, Client } from "discord.js";

import { Server } from "@/components/Server";

module.exports = {
    name: "status",
    description: "Affiche des informations à propos du serveur",
    category: "misc",

    async execute(_: Client, interaction: ChatInputCommandInteraction) {
        return await Server(interaction);
    },
};
