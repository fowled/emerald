import { ActionRowBuilder, ButtonBuilder, ButtonInteraction, Client } from "discord.js";

import { pb } from "@/index";

import { i18n } from "@/utils/i18n";

import type { Place } from "@/types/DB";

const { confirmPlaceDeleteButton, confirmPlaceDeleteMessage, errorPlaceDeleteMessage, successPlaceDeleteMessage } = i18n("places");

module.exports = {
    name: "deletePlace",

    async execute(_: Client, interaction: ButtonInteraction) {
        const getPlaceId = interaction.customId.replace(/[^0-9]/g, "");
        const confirmed = interaction.customId.includes("confirm");

        const places = await pb.collection("places").getFullList<Place>();

        switch (confirmed) {
            case false:
                const verification = new ActionRowBuilder<ButtonBuilder>().addComponents(
                    new ButtonBuilder()
                        .setCustomId(`place_delete_confirm_${getPlaceId}`)
                        .setStyle(4)
                        .setEmoji("⚠️")
                        .setLabel(confirmPlaceDeleteButton)
                );

                interaction.followUp({
                    content: confirmPlaceDeleteMessage,
                    ephemeral: true,
                    components: [verification],
                });
                break;

            case true:
                const findPlace = places.find((place) => place.place_id === parseInt(getPlaceId));

                if (findPlace) {
                    await pb.collection("places").delete(findPlace.id);
                } else {
                    return interaction.editReply({
                        content: errorPlaceDeleteMessage,
                        components: [],
                    });
                }

                interaction.editReply({
                    content: successPlaceDeleteMessage,
                    components: [],
                });
                break;
        }
    },
};
