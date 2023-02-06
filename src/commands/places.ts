import { ActionRowBuilder, ButtonBuilder, ChatInputCommandInteraction, Client } from "discord.js";

import { menu } from "@/components/Places";

module.exports = {
    name: "places",
    description: "Liste d'endroits sympa du serveur",
    category: "misc",

    async execute(_: Client, interaction: ChatInputCommandInteraction) {
        const button = new ActionRowBuilder<ButtonBuilder>().addComponents(
            new ButtonBuilder().setCustomId(`place_add_modal`).setStyle(3).setLabel("Ajouter").setEmoji("➕"),
            new ButtonBuilder().setCustomId(`place_refresh_null`).setStyle(1).setEmoji("🔄")
        );

        await interaction.editReply({ components: [await menu(), button] });
    },
};
