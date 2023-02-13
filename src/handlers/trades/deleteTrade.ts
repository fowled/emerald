import { ButtonInteraction, Client, StringSelectMenuInteraction } from "discord.js";

import { menu } from "@/components/Trades";

import { i18n } from "@/utils/i18n";

import { pb } from "@/index";

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
                    content: i18n("successTradeDeleteMessage", "trades"),
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
                        .setPlaceholder(i18n("selectMenuTradeDeletePlaceholder", "trades"));

                    await interaction.followUp({ components: [selectMenu], ephemeral: true });
                    break;
                } catch (err) {
                    await interaction.editReply({
                        components: [],
                        embeds: [],
                        content: i18n("errorTradeMessage", "trades"),
                    });
                    break;
                }
        }
    },
};
