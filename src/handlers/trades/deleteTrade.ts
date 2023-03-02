import { ButtonInteraction, Client, StringSelectMenuInteraction } from "discord.js";

import { menu } from "@/components/Trades";

import { i18n } from "@/utils/i18n";

import { pb } from "@/index";

const { successTradeDeleteMessage, selectMenuTradeDeletePlaceholder, errorTradeMessage } = i18n("trades");

module.exports = {
    name: "deleteTrade",

    async execute(_: Client, interaction: ButtonInteraction | StringSelectMenuInteraction) {
        const instruction = interaction.customId.split("_").at(2);

        let tradeId: string, placeId: string;

        switch (instruction) {
            case "submitted":
                tradeId = (interaction as StringSelectMenuInteraction).values.at(0);

                await pb.collection("trades").delete(tradeId);

                await interaction.editReply({
                    content: successTradeDeleteMessage,
                    components: [],
                });
                break;

            default:
                placeId = interaction.customId.split("_").at(2);

                const selectMenu = await menu(placeId);

                try {
                    selectMenu.components
                        .at(0)
                        .setCustomId("trades_delete_submitted")
                        .setPlaceholder(selectMenuTradeDeletePlaceholder);

                    await interaction.followUp({ components: [selectMenu], ephemeral: true });
                    break;
                } catch (err) {
                    await interaction.editReply({
                        components: [],
                        embeds: [],
                        content: errorTradeMessage,
                    });
                    break;
                }
        }
    },
};
