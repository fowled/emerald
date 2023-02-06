import { ActionRowBuilder, ButtonBuilder, ButtonInteraction, Client } from "discord.js";

import { pb } from "@/index";

import { i18n } from "@/utils/i18n";

import type { Place } from "@/types/DB";

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
                        .setLabel(i18n("confirmPlaceDeleteButton", "places"))
                );

                interaction.followUp({
                    content: i18n("confirmPlaceDeleteMessage", "places"),
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
                        content: i18n("errorPlaceDeleteMessage", "places"),
                        components: [],
                    });
                }

                interaction.editReply({
                    content: i18n("successPlaceDeleteMessage", "places"),
                    components: [],
                });
                break;
        }
    },
};
