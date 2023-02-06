import { ChatInputCommandInteraction, Client, EmbedBuilder } from "discord.js";

import { clientInteractions } from "@/index";

import { extractToken } from "@/lib/extractToken";
import { startServer } from "@/lib/startServer";

import { i18n } from "@/utils/i18n";

module.exports = {
    name: "start",
    description: i18n("description", "start"),
    category: "misc",

    async execute(Client: Client, interaction: ChatInputCommandInteraction, args: string[]) {
        const success = await startServer();

        switch (success) {
            case 1:
                const bootedUp = new EmbedBuilder().setDescription(i18n("success", "start")).setColor("Green");

                await interaction.editReply({ embeds: [bootedUp] });
                break;

            case 2:
                const alreadyLaunched = new EmbedBuilder().setDescription(i18n("error", "start")).setColor("Red");

                await interaction.editReply({ embeds: [alreadyLaunched] });
                break;

            case 3:
                const invalidToken = new EmbedBuilder()
                    .setDescription(i18n("invalidToken", "start"))
                    .setColor("Orange");

                await interaction.editReply({ embeds: [invalidToken] });

                await extractToken();

                await clientInteractions.get("start").execute(Client, interaction, args);
                break;
        }
    },
};
