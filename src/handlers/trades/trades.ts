import { ActionRowBuilder, ButtonBuilder, ButtonInteraction, Client } from "discord.js";

import { embed, actions, controls } from "@/components/Trades";

module.exports = {
    name: "trades",

    async execute(_Client: Client, interaction: ButtonInteraction) {
        const getPlaceId = interaction.customId.replace(/[^0-9]/g, "");

        try {
            return await interaction.editReply({
                content: null,
                embeds: [await embed(getPlaceId)],
                components: [await controls(getPlaceId), await actions(getPlaceId)],
            });
        } catch (error) {
            const buttons = new ActionRowBuilder<ButtonBuilder>().addComponents(
                new ButtonBuilder()
                    .setCustomId(`place_select_${getPlaceId}`)
                    .setLabel("Général")
                    .setEmoji("ℹ️")
                    .setStyle(1),
                    
                new ButtonBuilder()
                    .setCustomId("trades_add_modal_" + getPlaceId)
                    .setStyle(3)
                    .setLabel("En ajouter un")
                    .setEmoji("➕")
            );

            return await interaction.editReply({
                content: "On dirait qu'il n'y a aucun trade de disponible.",
                components: [buttons],
                embeds: [],
            });
        }
    },
};
