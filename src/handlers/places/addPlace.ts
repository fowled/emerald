import { ButtonInteraction, Client, ModalSubmitInteraction } from "discord.js";

import { modal } from "@/components/Places";

import { pb } from "@/index";

import { i18n } from "@/utils/i18n";

import type { Place } from "@/types/DB";

module.exports = {
    name: "addPlace",

    async execute(_: Client, interaction: ButtonInteraction | ModalSubmitInteraction) {
        const instruction = interaction.customId.split("_").at(2);

        switch (instruction) {
            case "submitted":
                const [description, dimension, x, y, z] = (interaction as ModalSubmitInteraction).fields.fields.map(
                    (field) => field.value
                );

                const places = await pb.collection("places").getFullList<Place>(200, { sort: "+place_id" });

                if (isNaN(parseInt(x)) || isNaN(parseInt(y)) || isNaN(parseInt(z))) {
                    return interaction.followUp({
                        content: i18n("invalidCoordsMessage", "places"),
                        ephemeral: true,
                    });
                }

                if (!["end", "nether", "overworld"].includes(dimension.toLowerCase())) {
                    return interaction.followUp({
                        content: i18n("invalidDimensionMessage", "places"),
                        ephemeral: true,
                    });
                }

                const data = {
                    place_id: places.at(-1).place_id + 1,
                    description,
                    dimension: dimension.toLowerCase(),
                    x: parseInt(x),
                    y: parseInt(y),
                    z: parseInt(z),
                };

                await pb.collection("places").create(data);

                await interaction.followUp({
                    content: i18n("successfulPlaceAddMessage", "places"),
                    ephemeral: true,
                });
                break;

            case "modal":
                const addPlaceModal = modal(false)
                    .setCustomId("place_add_submitted")
                    .setTitle(i18n("modalAddTitle", "places"));

                await (interaction as ButtonInteraction).showModal(addPlaceModal);
                break;
        }
    },
};
