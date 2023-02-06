import { ActionRowBuilder, ButtonBuilder, ButtonInteraction, Client } from "discord.js";

import { pb } from "@/index";

import type { Place } from "@/types/DB";

module.exports = {
    name: "deletePlace",

    async execute(Client: Client, interaction: ButtonInteraction) {
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
                        .setLabel("Je confirme")
                );

                interaction.followUp({
                    content: `Es-tu certain de vouloir supprimer l'endroit d'identifiant \`${getPlaceId}\`?`,
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
                        content: `Il n'existe pas d'endroit avec l'identifiant \`${getPlaceId}\`.`,
                        components: [],
                    });
                }

                interaction.editReply({
                    content: `L'élément n°\`${getPlaceId}\` a bien été supprimé.`,
                    components: [],
                });
                break;
        }
    },
};
