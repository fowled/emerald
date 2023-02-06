import { ButtonInteraction, Client, ModalSubmitInteraction, StringSelectMenuInteraction } from "discord.js";

import { modal, menu } from "@/components/Trades";

import { pb } from "@/index";

import type { Trade } from "@/types/DB";

module.exports = {
    name: "editTrade",

    async execute(_: Client, interaction: ButtonInteraction | StringSelectMenuInteraction | ModalSubmitInteraction) {
        const instruction = interaction.customId.split("_").at(2);

        let tradeId: string, placeId: string;

        switch (instruction) {
            case "modal":
                tradeId = (interaction as StringSelectMenuInteraction).values.at(0);

                modal.setCustomId("trades_edit_submitted_" + tradeId + "_" + placeId).setTitle("Modifier un trade");

                await (interaction as ButtonInteraction).showModal(modal);
                break;

            case "submitted":
                tradeId = interaction.customId.split("_").at(3);

                const [receiving, giving] = (interaction as ModalSubmitInteraction).fields.fields.map(
                    (field) => field.value
                );

                await pb.collection("trades").update<Trade>(tradeId, { receiving, giving });

                await interaction.editReply({
                    content: "J'ai modifié le trade :+1:",
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
                        .setPlaceholder("Choisis le trade à modifier");

                    await interaction.followUp({ components: [selectMenu], ephemeral: true });
                    break;
                } catch (err) {
                    await interaction.editReply({
                        components: [],
                        embeds: [],
                        content: "On dirait qu'il n'y a aucun trade associé à cet endroit.",
                    });
                    break;
                }
        }
    },
};
