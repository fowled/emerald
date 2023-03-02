import { ChatInputCommandInteraction, Client, EmbedBuilder } from "discord.js";

import { createBackup } from "@/lib/createBackup";
import { extractToken } from "@/lib/extractToken";

import { clientInteractions } from "@/index";

import { i18n } from "@/utils/i18n";

const { description, success, error, invalidToken } = i18n("backup");

module.exports = {
    name: "backup",
    description,
    category: "misc",

    async execute(Client: Client, interaction: ChatInputCommandInteraction, args: string[]) {
        const result = await createBackup();

        switch (result) {
            case 1:
                await interaction.editReply({
                    embeds: [new EmbedBuilder().setDescription(success).setColor("Green")],
                });
                break;

            case 2:
                await interaction.editReply({ embeds: [new EmbedBuilder().setDescription(error).setColor("Red")] });
                break;

            case 3:
                await interaction.editReply({
                    embeds: [new EmbedBuilder().setDescription(invalidToken).setColor("Orange")],
                });

                await extractToken();

                await clientInteractions.get("backup").execute(Client, interaction, args);
                break;
        }
    },
};
