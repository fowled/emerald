import { ChatInputCommandInteraction, Client, EmbedBuilder } from "discord.js";

import { createBackup } from "@/lib/createBackup";
import { extractToken } from "@/lib/extractToken";

import { clientInteractions } from "@/index";

import { i18n } from "@/utils/i18n";

module.exports = {
    name: "backup",
    description: i18n("description", "backup"),
    category: "misc",

    async execute(Client: Client, interaction: ChatInputCommandInteraction, args: string[]) {
        const success = await createBackup();

        switch (success) {
            case 1:
                const backupCreated = new EmbedBuilder().setDescription(i18n("success", "backup")).setColor("Green");

                await interaction.editReply({ embeds: [backupCreated] });
                break;

            case 2:
                const error = new EmbedBuilder().setDescription(i18n("error", "backup")).setColor("Red");

                await interaction.editReply({ embeds: [error] });
                break;

            case 3:
                const invalidToken = new EmbedBuilder()
                    .setDescription(i18n("invalidToken", "backup"))
                    .setColor("Orange");

                await interaction.editReply({ embeds: [invalidToken] });

                await extractToken();

                await clientInteractions.get("backup").execute(Client, interaction, args);
                break;
        }
    },
};
