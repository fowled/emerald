import { ChatInputCommandInteraction, Client, EmbedBuilder } from "discord.js";

import { clientInteractions } from "@/index";

import { extractToken } from "@/lib/extractToken";
import { startServer } from "@/lib/startServer";

import { i18n } from "@/utils/i18n";

const { description, success, error, invalidToken } = i18n("start");

module.exports = {
    name: "start",
    description,
    category: "misc",

    async execute(Client: Client, interaction: ChatInputCommandInteraction, args: string[]) {
        const result = await startServer();

        switch (result) {
            case 1:
                await interaction.editReply({ embeds: [new EmbedBuilder().setDescription(success).setColor("Green")] });
                break;

            case 2:
                await interaction.editReply({ embeds: [new EmbedBuilder().setDescription(error).setColor("Red")] });
                break;

            case 3:
                await interaction.editReply({
                    embeds: [new EmbedBuilder().setDescription(invalidToken).setColor("Orange")],
                });

                await extractToken();

                await clientInteractions.get("start").execute(Client, interaction, args);
                break;
        }
    },
};
