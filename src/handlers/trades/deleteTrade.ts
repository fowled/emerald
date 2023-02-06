import { ButtonInteraction, Client, StringSelectMenuInteraction } from "discord.js";

import { menu } from "@/components/Trades";

import { pb } from "@/index";

module.exports = {
    name: "deleteTrade",

    async execute(_Client: Client, interaction: ButtonInteraction | StringSelectMenuInteraction) {
        const instruction = interaction.customId.split("_").at(2);

        let tradeId: string, placeId: string;

        switch (instruction) {
            case "submitted":
                tradeId = (interaction as StringSelectMenuInteraction).values.at(0);

                await pb.collection("trades").delete(tradeId);

                await interaction.editReply({
                    content: "J'ai supprimé le trade :+1:",
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
                        .setPlaceholder("Choisis le trade à supprimer");

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
