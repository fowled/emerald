import { ButtonInteraction, Client, ModalSubmitInteraction } from "discord.js";

import { modal } from "@/components/Places";

import { pb } from "@/index";

import { i18n } from "@/utils/i18n";

import type { Place } from "@/types/DB";

module.exports = {
    name: "editPlace",

    async execute(_Client: Client, interaction: ButtonInteraction | ModalSubmitInteraction) {
        const getPlaceId = interaction.customId.replace(/[^0-9]/g, "");

        const instruction = interaction.customId.split("_").at(2);

        switch (instruction) {
            case "modal":
                const editPlaceModal = modal(true)
                    .setCustomId("place_edit_submitted_" + getPlaceId)
                    .setTitle(i18n("modalEditTitle", "places"));

                await (interaction as ButtonInteraction).showModal(editPlaceModal);
                break;

            case "submitted":
                const fields = (interaction as ModalSubmitInteraction).fields.fields;

                const place = await pb.collection("places").getFirstListItem<Place>(`place_id=${getPlaceId}`);

                const editData = {};

                for (const [_, value] of fields) {
                    if (value.value.length > 0) {
                        const extractFieldName = value.customId.split("_").at(-1);

                        if (place[extractFieldName] !== value.value.toLowerCase()) {
                            editData[extractFieldName] = value.value;
                        }
                    }
                }

                await pb.collection("places").update(place.id, editData);

                await interaction.followUp({ content: i18n("successPlaceEditMessage", "places"), ephemeral: true });
                break;
        }
    },
};
