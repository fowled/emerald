import { ActionRowBuilder, ButtonBuilder, ChatInputCommandInteraction, Client } from "discord.js";

import { menu } from "@/components/Places";

import { i18n } from "@/utils/i18n";

module.exports = {
    name: "places",
    description: i18n("description", "places"),
    category: "misc",

    async execute(_: Client, interaction: ChatInputCommandInteraction) {
        const button = new ActionRowBuilder<ButtonBuilder>().addComponents(
            new ButtonBuilder()
                .setCustomId(`place_add_modal`)
                .setStyle(3)
                .setLabel(i18n("addButton", "places"))
                .setEmoji("➕"),

            new ButtonBuilder().setCustomId(`place_refresh_null`).setStyle(1).setEmoji("🔄")
        );

        await interaction.editReply({ components: [await menu(), button] });
    },
};
