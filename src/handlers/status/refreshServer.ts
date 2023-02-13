import { ButtonInteraction, Client } from "discord.js";

import { Server } from "@/components/Server";

module.exports = {
    name: "refreshServer",

    async execute(_: Client, interaction: ButtonInteraction) {
        return await Server(interaction);
    },
};
