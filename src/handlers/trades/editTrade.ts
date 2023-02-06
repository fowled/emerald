import { ButtonInteraction, Client, ModalSubmitInteraction, StringSelectMenuInteraction } from "discord.js";

import { modal, menu } from "@/components/Trades";

import { pb } from "@/index";

import { i18n } from "@/utils/i18n";

import type { Trade } from "@/types/DB";

module.exports = {
    name: "editTrade",

    async execute(_: Client, interaction: ButtonInteraction | StringSelectMenuInteraction | ModalSubmitInteraction) {
        const instruction = interaction.customId.split("_").at(2);

        let tradeId: string, placeId: string;

        switch (instruction) {
            case "modal":
                tradeId = (interaction as StringSelectMenuInteraction).values.at(0);

                modal
                    .setCustomId("trades_edit_submitted_" + tradeId + "_" + placeId)
                    .setTitle(i18n("modalTradeEditTitle", "trades"));

                await (interaction as ButtonInteraction).showModal(modal);
                break;

            case "submitted":
                tradeId = interaction.customId.split("_").at(3);

                const [receiving, giving] = (interaction as ModalSubmitInteraction).fields.fields.map(
                    (field) => field.value
                );

                await pb.collection("trades").update<Trade>(tradeId, { receiving, giving });

                await interaction.editReply({
                    content: i18n("successTradeEditMessage", "trades"),
                    components: [],
                });
                break;

            default:
                placeId = interaction.customId.split("_").at(2);

                try {
                    const selectMenu = await menu(placeId);

                    selectMenu.components
                        .at(0)
                        .setCustomId("trades_edit_modal")
                        .setPlaceholder(i18n("selectMenuTradeEditPlaceholder", "trades"));

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
